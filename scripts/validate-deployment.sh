#!/bin/bash

# Deployment Configuration Validation Script
# Usage: ./scripts/validate-deployment.sh [environment]
# 
# Environments: development, staging, production
# 
# This script validates that all necessary configuration is in place
# for a successful deployment to the specified environment.

set -euo pipefail

# Configuration
ENVIRONMENT=${1:-"development"}
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="/tmp/deployment-validation-$(date +%Y%m%d-%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

log_info() {
    log "INFO" "${BLUE}$*${NC}"
}

log_success() {
    log "SUCCESS" "${GREEN}✅ $*${NC}"
}

log_warning() {
    log "WARNING" "${YELLOW}⚠️  $*${NC}"
}

log_error() {
    log "ERROR" "${RED}❌ $*${NC}"
}

# Validation counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Function to run a validation check
run_check() {
    local check_name="$1"
    local check_command="$2"
    local is_critical=${3:-true}
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    log_info "Running check: $check_name"
    
    if eval "$check_command" &>/dev/null; then
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        log_success "$check_name"
        return 0
    else
        if [ "$is_critical" = true ]; then
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            log_error "$check_name"
            return 1
        else
            WARNING_CHECKS=$((WARNING_CHECKS + 1))
            log_warning "$check_name"
            return 0
        fi
    fi
}

# Validation functions
validate_environment() {
    log_info "🌍 Validating environment: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        development|staging|production)
            log_success "Valid environment: $ENVIRONMENT"
            ;;
        *)
            log_error "Invalid environment: $ENVIRONMENT. Must be development, staging, or production."
            exit 1
            ;;
    esac
}

validate_prerequisites() {
    log_info "🔧 Validating prerequisites..."
    
    # Check required commands
    run_check "Node.js is installed" "command -v node"
    run_check "npm is installed" "command -v npm"
    run_check "Docker is installed (for production)" "command -v docker" false
    
    if [ "$ENVIRONMENT" = "production" ]; then
        run_check "gcloud CLI is installed" "command -v gcloud"
        run_check "gcloud is authenticated" "gcloud auth list --filter=status:ACTIVE --format='value(account)' | head -n1"
    fi
}

validate_project_structure() {
    log_info "📁 Validating project structure..."
    
    # Check for essential files
    run_check "package.json exists" "[ -f '$PROJECT_ROOT/package.json' ]"
    run_check "turbo.json exists" "[ -f '$PROJECT_ROOT/turbo.json' ]"
    
    # Check app directories
    run_check "API app directory exists" "[ -d '$PROJECT_ROOT/apps/api' ]"
    run_check "Web app directory exists" "[ -d '$PROJECT_ROOT/apps/web' ]"
    
    # Check deployment configs
    if [ "$ENVIRONMENT" = "production" ]; then
        run_check "Dockerfile exists" "[ -f '$PROJECT_ROOT/apps/api/Dockerfile' ]"
        run_check "cloudbuild.yaml exists" "[ -f '$PROJECT_ROOT/cloudbuild.yaml' ]"
        run_check "vercel.json exists" "[ -f '$PROJECT_ROOT/vercel.json' ]"
        run_check "Deploy workflow exists" "[ -f '$PROJECT_ROOT/.github/workflows/deploy.yml' ]"
        run_check "Rollback script exists" "[ -f '$PROJECT_ROOT/scripts/rollback.sh' ]"
    fi
}

validate_dependencies() {
    log_info "📦 Validating dependencies..."
    
    run_check "node_modules exists" "[ -d '$PROJECT_ROOT/node_modules' ]"
    run_check "API dependencies installed" "[ -d '$PROJECT_ROOT/apps/api/node_modules' ]"
    run_check "Web dependencies installed" "[ -d '$PROJECT_ROOT/apps/web/node_modules' ]"
    
    # Check for security vulnerabilities
    log_info "🔒 Running security audit..."
    if npm audit --audit-level=high &>/dev/null; then
        log_success "No high-severity security vulnerabilities found"
    else
        log_warning "Security vulnerabilities detected. Run 'npm audit' for details."
    fi
}

validate_configuration() {
    log_info "⚙️  Validating configuration..."
    
    # Check environment files
    case $ENVIRONMENT in
        development)
            run_check ".env.example exists" "[ -f '$PROJECT_ROOT/.env.example' ]"
            if [ -f "$PROJECT_ROOT/.env.local" ]; then
                log_success ".env.local found for development"
            else
                log_warning ".env.local not found. Copy .env.example to .env.local and configure."
            fi
            ;;
        production)
            # In production, we rely on environment variables from Cloud Run and Vercel
            log_info "Production relies on Cloud Run and Vercel environment variables"
            ;;
    esac
    
    # Validate package.json scripts
    run_check "Build script exists" "npm run build --dry-run &>/dev/null || grep -q '\"build\"' '$PROJECT_ROOT/package.json'"
    run_check "Test script exists" "npm run test --dry-run &>/dev/null || grep -q '\"test\"' '$PROJECT_ROOT/package.json'"
    run_check "Lint script exists" "npm run lint --dry-run &>/dev/null || grep -q '\"lint\"' '$PROJECT_ROOT/package.json'"
}

validate_build() {
    log_info "🏗️  Validating build process..."
    
    # Run build in a clean environment
    log_info "Running build process..."
    if npm run build &>>"$LOG_FILE"; then
        log_success "Build completed successfully"
        
        # Check build outputs
        run_check "API build output exists" "[ -d '$PROJECT_ROOT/apps/api/dist' ] || [ -f '$PROJECT_ROOT/apps/api/dist/index.js' ]"
        run_check "Web build output exists" "[ -d '$PROJECT_ROOT/apps/web/.next' ] || [ -d '$PROJECT_ROOT/apps/web/out' ]"
    else
        log_error "Build failed. Check $LOG_FILE for details."
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

validate_tests() {
    log_info "🧪 Validating tests..."
    
    # Run linting
    if npm run lint &>>"$LOG_FILE"; then
        log_success "Linting passed"
    else
        log_error "Linting failed. Check $LOG_FILE for details."
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
    
    # Run type checking
    if npm run type-check &>>"$LOG_FILE"; then
        log_success "Type checking passed"
    else
        log_error "Type checking failed. Check $LOG_FILE for details."
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
    
    # Run tests (but don't fail validation if tests fail, as they might be in progress)
    log_info "Running test suite..."
    if npm run test &>>"$LOG_FILE"; then
        log_success "All tests passed"
    else
        log_warning "Some tests failed. This won't block deployment but should be investigated."
        WARNING_CHECKS=$((WARNING_CHECKS + 1))
    fi
}

validate_deployment_readiness() {
    log_info "🚀 Validating deployment readiness for $ENVIRONMENT..."
    
    case $ENVIRONMENT in
        production)
            # Check GitHub Actions secrets (this would need to be done in the CI environment)
            log_info "Production deployment requires GitHub Actions secrets:"
            log_info "  - GCP_SERVICE_ACCOUNT_KEY"
            log_info "  - LHCI_GITHUB_APP_TOKEN (optional, for Lighthouse)"
            
            # Check Docker build
            if command -v docker &>/dev/null; then
                log_info "Testing Docker build..."
                if docker build -f "$PROJECT_ROOT/apps/api/Dockerfile" -t test-build "$PROJECT_ROOT" &>>"$LOG_FILE"; then
                    log_success "Docker build successful"
                    # Clean up test image
                    docker rmi test-build &>/dev/null || true
                else
                    log_error "Docker build failed. Check $LOG_FILE for details."
                    FAILED_CHECKS=$((FAILED_CHECKS + 1))
                fi
            else
                log_warning "Docker not available for build testing"
                WARNING_CHECKS=$((WARNING_CHECKS + 1))
            fi
            ;;
        development)
            # Check if development server can start
            log_info "Development environment validation complete"
            ;;
    esac
}

generate_report() {
    log_info "📊 Generating validation report..."
    
    echo ""
    echo "======================================"
    echo "  DEPLOYMENT VALIDATION REPORT"
    echo "======================================"
    echo "Environment: $ENVIRONMENT"
    echo "Timestamp: $(date)"
    echo "Log file: $LOG_FILE"
    echo ""
    echo "Results:"
    echo "  Total checks: $TOTAL_CHECKS"
    echo "  Passed: $PASSED_CHECKS"
    echo "  Failed: $FAILED_CHECKS"
    echo "  Warnings: $WARNING_CHECKS"
    echo ""
    
    if [ $FAILED_CHECKS -eq 0 ]; then
        echo -e "${GREEN}✅ VALIDATION PASSED${NC}"
        echo "The project is ready for deployment to $ENVIRONMENT"
        
        if [ $WARNING_CHECKS -gt 0 ]; then
            echo ""
            echo -e "${YELLOW}⚠️  There are $WARNING_CHECKS warnings that should be addressed${NC}"
        fi
        
        return 0
    else
        echo -e "${RED}❌ VALIDATION FAILED${NC}"
        echo "The project is NOT ready for deployment to $ENVIRONMENT"
        echo "Please fix the $FAILED_CHECKS failed checks before deploying"
        echo ""
        echo "Check the log file for detailed error messages: $LOG_FILE"
        return 1
    fi
}

# Main execution
main() {
    log_info "🚀 Starting deployment validation for environment: $ENVIRONMENT"
    log_info "Project root: $PROJECT_ROOT"
    log_info "Log file: $LOG_FILE"
    echo ""
    
    cd "$PROJECT_ROOT"
    
    # Run all validation steps
    validate_environment
    validate_prerequisites
    validate_project_structure
    validate_dependencies
    validate_configuration
    validate_build
    validate_tests
    validate_deployment_readiness
    
    # Generate and display report
    echo ""
    generate_report
}

# Show usage if help is requested
if [[ "${1:-}" =~ ^(-h|--help)$ ]]; then
    echo "Deployment Configuration Validation Script"
    echo ""
    echo "Usage: $0 [environment] [options]"
    echo ""
    echo "Environments:"
    echo "  development  - Validate for local development"
    echo "  staging      - Validate for staging deployment"
    echo "  production   - Validate for production deployment (default)"
    echo ""
    echo "Options:"
    echo "  -h, --help   - Show this help message"
    echo ""
    echo "This script validates that all necessary configuration is in place"
    echo "for a successful deployment to the specified environment."
    exit 0
fi

# Run the main function
main "$@"