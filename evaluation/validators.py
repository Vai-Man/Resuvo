import re
from typing import Dict, List, Tuple
from dataclasses import dataclass

@dataclass(frozen=True)
class ValidationError:
    field: str
    message: str

class InputValidator:
    MIN_INTERVIEW = 50
    MAX_INTERVIEW = 5000
    MIN_RESUME = 100
    MAX_RESUME = 50000
    MIN_JOB_DESC = 50
    MAX_JOB_DESC = 10000
    
    @staticmethod
    def validate_interview_answer(answer: str) -> Tuple[bool, List[ValidationError]]:
        errors: List[ValidationError] = []
        
        if not answer or not answer.strip():
            errors.append(ValidationError("answer", "Cannot be empty"))
            return False, errors
        
        length = len(answer.strip())
        if length < InputValidator.MIN_INTERVIEW:
            errors.append(ValidationError("answer", f"Too short (min {InputValidator.MIN_INTERVIEW})"))
        if length > InputValidator.MAX_INTERVIEW:
            errors.append(ValidationError("answer", f"Too long (max {InputValidator.MAX_INTERVIEW})"))
        
        return len(errors) == 0, errors
    
    @staticmethod
    def validate_resume(content: str) -> Tuple[bool, List[ValidationError]]:
        errors: List[ValidationError] = []
        
        if not content or not content.strip():
            errors.append(ValidationError("resume", "Cannot be empty"))
            return False, errors
        
        length = len(content.strip())
        if length < InputValidator.MIN_RESUME:
            errors.append(ValidationError("resume", f"Too short (min {InputValidator.MIN_RESUME})"))
        if length > InputValidator.MAX_RESUME:
            errors.append(ValidationError("resume", f"Too long (max {InputValidator.MAX_RESUME})"))
        
        return len(errors) == 0, errors
    
    @staticmethod
    def validate_job_description(description: str) -> Tuple[bool, List[ValidationError]]:
        errors: List[ValidationError] = []
        
        if not description or not description.strip():
            errors.append(ValidationError("job_desc", "Cannot be empty"))
            return False, errors
        
        length = len(description.strip())
        if length < InputValidator.MIN_JOB_DESC:
            errors.append(ValidationError("job_desc", f"Too short (min {InputValidator.MIN_JOB_DESC})"))
        if length > InputValidator.MAX_JOB_DESC:
            errors.append(ValidationError("job_desc", f"Too long (max {InputValidator.MAX_JOB_DESC})"))
        
        return len(errors) == 0, errors

class OutputValidator:
    REQUIRED: Dict[str, type] = {
        "score": float,
        "feedback": str,
        "strengths": list,
        "improvements": list
    }
    
    @staticmethod
    def validate_output(data: Dict) -> Tuple[bool, List[ValidationError]]:
        errors: List[ValidationError] = []
        
        if not isinstance(data, dict):
            errors.append(ValidationError("output", "Must be dictionary"))
            return False, errors
        
        for field, expected_type in OutputValidator.REQUIRED.items():
            if field not in data:
                errors.append(ValidationError(field, "Required field missing"))
            elif not isinstance(data[field], expected_type):
                errors.append(ValidationError(field, f"Must be {expected_type.__name__}"))
        
        if "score" in data:
            score = data["score"]
            if isinstance(score, (int, float)):
                if not (0 <= score <= 4):
                    errors.append(ValidationError("score", "Must be 0-4"))
        
        if "strengths" in data and data["strengths"]:
            if not all(isinstance(s, str) for s in data["strengths"]):
                errors.append(ValidationError("strengths", "Items must be strings"))
        
        if "improvements" in data and data["improvements"]:
            if not all(isinstance(i, str) for i in data["improvements"]):
                errors.append(ValidationError("improvements", "Items must be strings"))
        
        return len(errors) == 0, errors

class ContentSanitizer:
    PATTERNS = [
        r'<script[^>]*>.*?</script>',
        r'javascript:',
        r'on\w+\s*=',
        r'<iframe',
        r'<object',
        r'<embed'
    ]
    
    COMPILED = [re.compile(p, re.IGNORECASE | re.DOTALL) for p in PATTERNS]
    
    @staticmethod
    def sanitize(content: str) -> str:
        if not isinstance(content, str):
            return ""
        
        result = content
        for pattern in ContentSanitizer.COMPILED:
            result = pattern.sub("", result)
        
        return result.strip()
    
    @staticmethod
    def is_safe(content: str) -> bool:
        if not isinstance(content, str):
            return False
        
        return all(not pattern.search(content) for pattern in ContentSanitizer.COMPILED)
