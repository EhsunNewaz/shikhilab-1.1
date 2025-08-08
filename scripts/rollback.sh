#!/bin/bash

# Enhanced Rollback script for Cloud Run deployment with comprehensive error handling
# Usage: ./scripts/rollback.sh [SERVICE_NAME] [REGION] [--force] [--dry-run]
# 
# Options:
#   --force    Force rollback even if current service appears healthy
#   --dry-run  Show what would be done without making changes

set -euo pipefail  # Enhanced error handling

# Parse command line arguments
SERVICE_NAME=""
REGION=""
FORCE_ROLLBACK=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --force)
      FORCE_ROLLBACK=true
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    -*)
      echo "Unknown option: $1"
      exit 1
      ;;
    *)
      if [ -z "$SERVICE_NAME" ]; then
        SERVICE_NAME="$1"
      elif [ -z "$REGION" ]; then
        REGION="$1"
      fi
      shift
      ;;
  esac
done

# Set defaults
SERVICE_NAME=${SERVICE_NAME:-"shikhi-api"}
REGION=${REGION:-"us-central1"}
HEALTH_ENDPOINT="https://api.shikhi-ielts.com/health"
MAX_RETRIES=5
RETRY_DELAY=15
ROLLBACK_TIMEOUT=300  # 5 minutes

# Validate dependencies
if ! command -v gcloud &> /dev/null; then
    log "❌ gcloud CLI not found. Please install Google Cloud SDK."
    exit 1
fi

if ! command -v curl &> /dev/null; then
    log "❌ curl not found. Please install curl."
    exit 1
fi

if ! command -v jq &> /dev/null; then
    log "⚠️ jq not found. JSON parsing will be limited."
fi

# Validate authentication
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 > /dev/null 2>&1; then
    log "❌ No active gcloud authentication found. Please run 'gcloud auth login'."
    exit 1
fi

log "🔄 Starting enhanced rollback process for service: $SERVICE_NAME in region: $REGION"

if [ "$DRY_RUN" = true ]; then
    log "🏃 DRY RUN MODE - No actual changes will be made"
fi

if [ "$FORCE_ROLLBACK" = true ]; then
    log "⚠️ FORCE MODE - Rollback will proceed even if service appears healthy"
fi

# Enhanced logging with timestamps
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to check health endpoint with detailed diagnostics
check_health() {
    local retries=0
    local endpoint=${1:-$HEALTH_ENDPOINT}
    local expected_status=${2:-"healthy"}
    
    log "🏥 Starting health check for: $endpoint"
    
    while [ $retries -lt $MAX_RETRIES ]; do
        log "Health check attempt $((retries + 1))/$MAX_RETRIES..."
        
        # More detailed health check
        local response=$(curl -sf -w "HTTPSTATUS:%{http_code}" "$endpoint" 2>/dev/null || echo "HTTPSTATUS:000")
        local body=$(echo "$response" | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
        local status=$(echo "$response" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
        
        if [ "$status" = "200" ]; then
            # Check if response contains expected status
            if echo "$body" | grep -q "\"status\":\"$expected_status\""; then
                log "✅ Health check passed (HTTP: $status, Status: $expected_status)"
                return 0
            else
                log "⚠️ HTTP 200 but unexpected status in response: $body"
            fi
        else
            log "❌ Health check failed with HTTP status: $status"
        fi
        
        retries=$((retries + 1))
        if [ $retries -lt $MAX_RETRIES ]; then
            log "⏳ Waiting ${RETRY_DELAY}s before retry..."
            sleep $RETRY_DELAY
        fi
    done
    
    log "💥 All health check attempts failed"
    return 1
}

# Function to get service URL
get_service_url() {
    local service_url
    service_url=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format='value(status.url)' 2>/dev/null || echo "")
    
    if [ -z "$service_url" ]; then
        log "❌ Could not retrieve service URL for $SERVICE_NAME in $REGION"
        return 1
    fi
    
    echo "$service_url"
    return 0
}

# Function for safe gcloud operations with retry
safe_gcloud() {
    local cmd=("$@")
    local retries=0
    local max_retries=3
    
    while [ $retries -lt $max_retries ]; do
        if "${cmd[@]}"; then
            return 0
        else
            retries=$((retries + 1))
            if [ $retries -lt $max_retries ]; then
                log "⚠️ gcloud command failed, retrying in 10 seconds... (attempt $((retries + 1))/$max_retries)"
                sleep 10
            fi
        fi
    done
    
    log "💥 gcloud command failed after $max_retries attempts: ${cmd[*]}"
    return 1
}

# Check current service health (unless forced)
if [ "$FORCE_ROLLBACK" != true ]; then
    log "🔍 Checking current service health before rollback..."
    SERVICE_URL=$(get_service_url)
    
    if [ $? -eq 0 ] && check_health "$SERVICE_URL/health"; then
        log "✅ Current service appears healthy. Use --force to rollback anyway."
        log "🛑 Rollback aborted. Service is functioning normally."
        exit 0
    else
        log "❌ Current service is unhealthy. Proceeding with rollback..."
    fi
else
    log "⚠️ Skipping health check due to --force flag"
fi

# Get current revisions with better error handling
log "📋 Fetching current revisions..."
REVISIONS=$(safe_gcloud run revisions list --service="$SERVICE_NAME" --region="$REGION" --format="value(metadata.name)" --sort-by="~metadata.creationTimestamp" --limit=5)

if [ -z "$REVISIONS" ]; then
    echo "❌ No revisions found for service $SERVICE_NAME"
    exit 1
fi

# Convert to array and validate
if [ -z "$REVISIONS" ]; then
    log "❌ No revisions found for service $SERVICE_NAME in region $REGION"
    log "💡 Available services in region:"
    gcloud run services list --region="$REGION" --format="table(metadata.name,status.url)" || true
    exit 1
fi

REVISION_ARRAY=($REVISIONS)
CURRENT_REVISION=${REVISION_ARRAY[0]:-}
PREVIOUS_REVISION=${REVISION_ARRAY[1]:-}

log "📊 Found ${#REVISION_ARRAY[@]} revisions:"
for i in "${!REVISION_ARRAY[@]}"; do
    log "  $((i+1)). ${REVISION_ARRAY[i]}"
done

if [ -z "$PREVIOUS_REVISION" ]; then
    log "❌ No previous revision found to rollback to"
    log "💡 This might be the first deployment. Cannot rollback."
    exit 1
fi

log "🔍 Current revision: $CURRENT_REVISION"
log "🔙 Target rollback revision: $PREVIOUS_REVISION"

# Get revision details for confirmation
log "📊 Revision details:"
log "Current: $(gcloud run revisions describe "$CURRENT_REVISION" --region="$REGION" --format='value(metadata.creationTimestamp,spec.template.spec.containers[0].image)' 2>/dev/null || echo 'Unknown')"
log "Previous: $(gcloud run revisions describe "$PREVIOUS_REVISION" --region="$REGION" --format='value(metadata.creationTimestamp,spec.template.spec.containers[0].image)' 2>/dev/null || echo 'Unknown')"

if [ "$DRY_RUN" = true ]; then
    log "🏃 DRY RUN: Would rollback from $CURRENT_REVISION to $PREVIOUS_REVISION"
    exit 0
fi

# Confirm rollback (unless in CI/automated environment)
if [ -t 0 ] && [ "$FORCE_ROLLBACK" != true ]; then
    read -p "❓ Continue with rollback? [y/N]: " -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "🛑 Rollback cancelled by user"
        exit 0
    fi
fi

# Perform rollback with zero-downtime traffic shift
log "🚀 Executing rollback with zero-downtime traffic shift..."
START_TIME=$(date +%s)

if safe_gcloud run services update-traffic "$SERVICE_NAME" --to-revisions="$PREVIOUS_REVISION=100" --region="$REGION"; then
    log "✅ Traffic successfully shifted to previous revision"
else
    log "❌ Failed to shift traffic during rollback"
    exit 1
fi

END_TIME=$(date +%s)
ROLLBACK_DURATION=$((END_TIME - START_TIME))
log "⚡ Rollback completed in ${ROLLBACK_DURATION}s"

# Verify rollback success with progressive verification
log "🔍 Verifying rollback success..."
log "⏳ Allowing 60 seconds for traffic shift to propagate..."
sleep 60

# Get updated service URL (in case it changed)
SERVICE_URL=$(get_service_url)
if [ $? -ne 0 ]; then
    log "❌ Could not retrieve service URL after rollback"
    exit 1
fi

log "🏥 Starting post-rollback health verification..."
if check_health "$SERVICE_URL/health"; then
    log "🎉 Rollback completed successfully!"
    log "✅ Service is healthy on revision: $PREVIOUS_REVISION"
    log "🌐 Service URL: $SERVICE_URL"
    
    # Additional verification: check multiple endpoints if available
    log "🔍 Performing additional endpoint verification..."
    
    # Test basic connectivity with performance measurement
    START_TIME=$(date +%s%3N)
    if curl -sf "$SERVICE_URL/health" > /dev/null 2>&1; then
        END_TIME=$(date +%s%3N)
        RESPONSE_TIME=$((END_TIME - START_TIME))
        log "⚡ Response time: ${RESPONSE_TIME}ms"
        
        if [ $RESPONSE_TIME -lt 2000 ]; then
            log "🚀 Excellent performance after rollback"
        elif [ $RESPONSE_TIME -lt 5000 ]; then
            log "⚠️ Acceptable performance after rollback (${RESPONSE_TIME}ms)"
        else
            log "🐌 Slow response after rollback (${RESPONSE_TIME}ms)"
        fi
    fi
    
    # Optionally clean up failed revision with enhanced safety
    if [ -t 0 ] && [ ${#REVISION_ARRAY[@]} -gt 2 ]; then
        read -p "❓ Delete the failed revision $CURRENT_REVISION? This cannot be undone. [y/N]: " -r
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log "🗑️ Deleting failed revision: $CURRENT_REVISION"
            if safe_gcloud run revisions delete "$CURRENT_REVISION" --region="$REGION" --quiet; then
                log "✅ Failed revision deleted successfully"
            else
                log "⚠️ Failed to delete revision $CURRENT_REVISION (this is non-critical)"
            fi
        else
            log "📝 Failed revision $CURRENT_REVISION kept for debugging"
        fi
    elif [ ${#REVISION_ARRAY[@]} -le 2 ]; then
        log "📝 Keeping failed revision for safety (only 2 revisions available)"
    fi
    
    # Final status summary
    log "📊 Rollback Summary:"
    log "  Service: $SERVICE_NAME"
    log "  Region: $REGION"
    log "  Rolled back from: $CURRENT_REVISION"
    log "  Rolled back to: $PREVIOUS_REVISION"
    log "  Duration: ${ROLLBACK_DURATION}s"
    log "  Status: SUCCESS ✅"
    
else
    log "❌ Rollback verification failed!"
    log "⚠️ Service may still be unhealthy after rollback."
    log "🔧 Manual intervention required:"
    log "   1. Check Cloud Run console: https://console.cloud.google.com/run"
    log "   2. Check Cloud Run logs: gcloud run services logs read $SERVICE_NAME --region=$REGION"
    log "   3. Consider manual traffic split or service restart"
    log "   4. Check health endpoint manually: curl $SERVICE_URL/health"
    
    # Attempt to gather diagnostic information
    log "📊 Diagnostic Information:"
    log "Current traffic allocation:"
    gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format="table(status.traffic.revisionName,status.traffic.percent)" 2>/dev/null || log "Could not retrieve traffic allocation"
    
    exit 1
fi