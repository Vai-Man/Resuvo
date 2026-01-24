# Resuvo Evaluation Engine

Python implementation of the core evaluation pipeline described in the main README.

## Architecture

```
Input Validation → Sanitization → Rubric Evaluation → Output Validation → Response
```

## Modules

### `rubrics.py`
Defines explicit evaluation rubrics for interviews and resumes.

**InterviewRubric:**
- Clarity (25% weight)
- Technical Depth (25%)
- Storytelling (25%)
- Confidence (25%)

**ResumeRubric:**
- ATS Compatibility (20%)
- Achievement Quantification (25%)
- Keyword Optimization (20%)
- Structure & Clarity (20%)
- Gap Identification (15%)

### `validators.py`
Input validation, output validation, and content sanitization.

**InputValidator:**
- Length limits and format checks
- Resume section verification
- Job context validation

**OutputValidator:**
- Evaluates AI response schema
- Ensures all required fields present
- Validates score ranges

**ContentSanitizer:**
- Prevents injection attacks
- Removes dangerous patterns

### `pipeline.py`
Orchestrates the full evaluation workflow.

**EvaluationPipeline:**
- Routes requests to appropriate evaluator
- Manages validation and response generation
- Returns structured results

**InterviewEvaluator & ResumeEvaluator:**
- Apply rubric criteria
- Calculate weighted scores
- Generate structured context for AI service

### `test_evaluation.py`
Comprehensive test suite covering:
- Input validation edge cases
- Rubric weight calculations
- Content sanitization
- Output schema validation

## Usage

```python
from evaluation import EvaluationPipeline

pipeline = EvaluationPipeline()

# Evaluate interview answer
result = pipeline.evaluate_interview_answer(
    answer="My experience with microservices...",
    question="Describe your architecture experience"
)

# Evaluate resume
result = pipeline.evaluate_resume(
    resume_text="EXPERIENCE...",
    job_title="Senior Software Engineer"
)
```

## Design Philosophy

1. **Explicit Rubrics:** All evaluation criteria defined and weighted in code
2. **Validation-First:** Input validated before any processing
3. **Structured Output Contract:** JSON schema ensures consistent responses
4. **Pluggable AI:** Evaluation context prepared for external LLM API
5. **Error Handling:** Graceful fallbacks, never crashes on bad input

## Running Tests

```bash
pytest test_evaluation.py -v
```

## Extending Rubrics

To add new criteria:

1. Update `rubrics.py` with new `RubricCriterion`
2. Update weights to sum to 1.0
3. Add test cases in `test_evaluation.py`
4. Update validators if needed
