# **4. Data Models**

This section contains the complete DDL for all relational tables in **Cloud SQL** and the document structure for collections in **Firestore**.

### **Cloud SQL Schema**

```sql
-- ENUM types
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE ielts_test_type AS ENUM ('academic', 'general_training');
CREATE TYPE ielts_simulation_format AS ENUM ('paper_based', 'computer_based');
CREATE TYPE ielts_section_type AS ENUM ('listening', 'reading', 'writing', 'speaking');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE material_type AS ENUM ('video', 'pdf', 'text', 'quiz');
CREATE TYPE material_category AS ENUM ('pre_class', 'in_class', 'post_class');
CREATE TYPE submission_status AS ENUM ('in_progress', 'completed', 'abandoned');

-- users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    ai_credits INTEGER NOT NULL DEFAULT 500,
    target_band_score DECIMAL(2, 1),
    target_test_date DATE,
    interface_language VARCHAR(10) NOT NULL DEFAULT 'en',
    ai_feedback_language VARCHAR(10) NOT NULL DEFAULT 'bn',
    gamification_opt_out BOOLEAN NOT NULL DEFAULT false,
    gamification_is_anonymous BOOLEAN NOT NULL DEFAULT false,
    current_streak INTEGER NOT NULL DEFAULT 0,
    points_balance INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- classes Table
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_number INTEGER NOT NULL,
    release_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(course_id, order_number)
);

-- course_enrollments Table
CREATE TABLE course_enrollments (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(user_id, course_id)
);

-- mistake_categories Table
CREATE TABLE mistake_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- lesson_materials Table
CREATE TABLE lesson_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    material_type material_type NOT NULL,
    category material_category NOT NULL,
    content_url TEXT,
    content_text TEXT,
    order_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(class_id, order_number)
);

-- lesson_material_mistake_tags Table
CREATE TABLE lesson_material_mistake_tags (
    lesson_material_id UUID NOT NULL REFERENCES lesson_materials(id) ON DELETE CASCADE,
    mistake_category_id UUID NOT NULL REFERENCES mistake_categories(id) ON DELETE CASCADE,
    PRIMARY KEY(lesson_material_id, mistake_category_id)
);

-- mock_tests Table
CREATE TABLE mock_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    test_type ielts_test_type NOT NULL,
    simulation_format ielts_simulation_format NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    status content_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(title, test_type, simulation_format, version)
);

-- test_sections Table
CREATE TABLE test_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mock_test_id UUID NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
    section_type ielts_section_type NOT NULL,
    order_number INTEGER NOT NULL CHECK (order_number BETWEEN 1 AND 4),
    duration_minutes INTEGER NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(mock_test_id, section_type),
    UNIQUE(mock_test_id, order_number)
);

-- test_submissions Table
CREATE TABLE test_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mock_test_id UUID NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
    status submission_status NOT NULL DEFAULT 'in_progress',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    time_remaining_seconds JSONB,
    listening_score DECIMAL(2, 1),
    reading_score DECIMAL(2, 1),
    writing_score DECIMAL(2, 1),
    final_score DECIMAL(2, 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- speaking_submissions Table
CREATE TABLE speaking_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mock_test_id UUID NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
    main_submission_id UUID REFERENCES test_submissions(id),
    status submission_status NOT NULL DEFAULT 'in_progress',
    speaking_score DECIMAL(2, 1),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- student_answers Table
CREATE TABLE student_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_submission_id UUID NOT NULL REFERENCES test_submissions(id) ON DELETE CASCADE,
    question_id VARCHAR(255) NOT NULL,
    answer_content JSONB,
    is_flagged_for_review BOOLEAN NOT NULL DEFAULT false,
    grading_result JSONB,
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(test_submission_id, question_id)
);
```

### **Firestore Collections**

  * **Collection:** `student_mistakes`
  * **Document Structure:**
    ```json
    {
      "userId": "string",
      "submissionId": "string",
      "mistakeCategoryId": "string",
      "mistakeCategoryName": "string",
      "sourceMaterialId": "string",
      "sourceType": "string",
      "originalText": "string",
      "correctedText": "string",
      "aiExplanation": "string",
      "timestamp": "Timestamp"
    }
    ```

-----
