from typing import Dict, Any, Optional
from dataclasses import dataclass

from rubrics import InterviewRubric, ResumeRubric
from validators import InputValidator, OutputValidator, ContentSanitizer

@dataclass(frozen=True)
class EvaluationResult:
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class InterviewEvaluator:
    def __init__(self):
        self.rubric = InterviewRubric()
    
    def evaluate(self, answer: str, question: str) -> EvaluationResult:
        valid, errors = InputValidator.validate_interview_answer(answer)
        if not valid:
            return EvaluationResult(
                success=False,
                error=f"{errors[0].field}: {errors[0].message}"
            )
        
        sanitized = ContentSanitizer.sanitize(answer)
        
        evaluation_context = {
            "question": question,
            "answer": sanitized,
            "criteria": [
                {
                    "name": c.name,
                    "weight": c.weight,
                    "levels": c.levels
                }
                for c in self.rubric.criteria
            ]
        }
        
        return EvaluationResult(
            success=True,
            data={
                "context": evaluation_context,
                "schema": {
                    "clarity": "int (1-4)",
                    "technical_depth": "int (1-4)",
                    "storytelling": "int (1-4)",
                    "confidence": "int (1-4)",
                    "improvements": ["str"],
                    "summary": "str"
                }
            }
        )
    
    def calculate_score(self, scores: Dict[str, int]) -> float:
        total = sum(scores.get(c.name, 1) * c.weight for c in self.rubric.criteria)
        return round(total, 2)

class ResumeEvaluator:
    def __init__(self):
        self.rubric = ResumeRubric()
    
    def evaluate(self, resume_text: str, job_title: Optional[str] = None) -> EvaluationResult:
        valid, errors = InputValidator.validate_resume(resume_text)
        if not valid:
            return EvaluationResult(
                success=False,
                error=f"{errors[0].field}: {errors[0].message}"
            )
        
        sanitized = ContentSanitizer.sanitize(resume_text)
        sections = self._extract_sections(sanitized)
        
        evaluation_context = {
            "resume_preview": sanitized[:500],
            "sections": list(sections.keys()),
            "target_job": job_title or "General",
            "criteria": [
                {
                    "name": c.name,
                    "weight": c.weight,
                    "levels": c.levels
                }
                for c in self.rubric.criteria
            ]
        }
        
        return EvaluationResult(
            success=True,
            data={
                "context": evaluation_context,
                "schema": {
                    "ats_score": "int (0-100)",
                    "missing_keywords": ["str"],
                    "gaps": ["str"],
                    "recommendations": ["str"]
                }
            }
        )
    
    def _extract_sections(self, resume: str) -> Dict[str, bool]:
        keywords = {
            "experience": ["experience", "employment", "work"],
            "education": ["education", "degree", "university"],
            "skills": ["skills", "technical", "competencies"],
            "projects": ["projects", "portfolio"],
            "certifications": ["certification"]
        }
        
        lower = resume.lower()
        return {sec: any(kw in lower for kw in kws) 
                for sec, kws in keywords.items()}
    
    def calculate_score(self, scores: Dict[str, int]) -> float:
        total = sum(scores.get(c.name, 1) * c.weight for c in self.rubric.criteria)
        return round(total, 2)

class EvaluationPipeline:
    def __init__(self):
        self.interview_evaluator = InterviewEvaluator()
        self.resume_evaluator = ResumeEvaluator()
    
    def evaluate_interview(self, answer: str, question: str) -> EvaluationResult:
        return self.interview_evaluator.evaluate(answer, question)
    
    def evaluate_resume(self, resume_text: str, job_title: Optional[str] = None) -> EvaluationResult:
        return self.resume_evaluator.evaluate(resume_text, job_title)
