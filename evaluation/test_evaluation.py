import pytest
from pipeline import EvaluationPipeline, InterviewEvaluator, ResumeEvaluator
from validators import InputValidator, OutputValidator, ContentSanitizer

class TestInputValidation:
    def test_empty_interview_answer(self):
        valid, errors = InputValidator.validate_interview_answer("")
        assert not valid
        assert len(errors) > 0
    
    def test_short_interview_answer(self):
        valid, errors = InputValidator.validate_interview_answer("too short")
        assert not valid
    
    def test_valid_interview_answer(self):
        answer = "This is a valid interview answer with sufficient length and detail about my experience and accomplishments in my previous role."
        valid, errors = InputValidator.validate_interview_answer(answer)
        assert valid
        assert len(errors) == 0
    
    def test_empty_resume(self):
        valid, errors = InputValidator.validate_resume("")
        assert not valid
    
    def test_long_interview_answer(self):
        answer = "x" * 6000
        valid, errors = InputValidator.validate_interview_answer(answer)
        assert not valid
    
    def test_valid_resume(self):
        resume = """
        EXPERIENCE:
        Senior Developer at Company - Led team, improved performance by 40%
        
        EDUCATION:
        BS Computer Science from State University
        
        SKILLS:
        Python, Java, React, PostgreSQL, AWS
        """
        valid, errors = InputValidator.validate_resume(resume)
        assert valid
        assert len(errors) == 0

class TestInterviewEvaluator:
    def setup_method(self):
        self.evaluator = InterviewEvaluator()
    
    def test_rubric_criteria_present(self):
        names = {c.name for c in self.evaluator.rubric.criteria}
        assert names == {"clarity", "technical_depth", "storytelling", "confidence"}
    
    def test_score_calculation(self):
        scores = {
            "clarity": 4,
            "technical_depth": 3,
            "storytelling": 4,
            "confidence": 3
        }
        result = self.evaluator.calculate_score(scores)
        expected = 3.75
        assert result == expected
    
    def test_evaluate_valid_answer(self):
        answer = "I led a team through a critical migration, coordinating across 5 departments to ensure zero downtime. The result was 40% faster deployments and 99.99% uptime."
        result = self.evaluator.evaluate(answer, "Tell me about leadership")
        assert result.success
        assert result.data is not None
    
    def test_evaluate_invalid_answer(self):
        result = self.evaluator.evaluate("", "question")
        assert not result.success
        assert result.error is not None

class TestResumeEvaluator:
    def setup_method(self):
        self.evaluator = ResumeEvaluator()
    
    def test_rubric_criteria_present(self):
        names = {c.name for c in self.evaluator.rubric.criteria}
        expected = {"ats_compatibility", "achievement_quantification", "keyword_optimization", "structure_clarity", "gap_identification"}
        assert names == expected
    
    def test_section_extraction(self):
        resume = """
        EXPERIENCE:
        Senior Dev at Corp
        
        EDUCATION:
        BS Comp Sci
        """
        sections = self.evaluator._extract_sections(resume)
        assert sections["experience"]
        assert sections["education"]
        assert not sections["skills"]
    
    def test_evaluate_valid_resume(self):
        resume = """
        EXPERIENCE:
        Senior Developer at Tech Corp - Led migration, reduced latency 30%
        
        EDUCATION:
        BS Computer Science from State University
        
        SKILLS:
        Python, Kubernetes, PostgreSQL, AWS
        """
        result = self.evaluator.evaluate(resume, "Software Engineer")
        assert result.success
        assert result.data is not None
    
    def test_evaluate_invalid_resume(self):
        result = self.evaluator.evaluate("", "")
        assert not result.success

class TestContentSanitization:
    def test_removes_script_tags(self):
        malicious = "Normal text<script>alert('xss')</script>more"
        clean = ContentSanitizer.sanitize(malicious)
        assert "<script>" not in clean.lower()
    
    def test_removes_event_handlers(self):
        malicious = "<img src=x onerror=alert('xss')>"
        clean = ContentSanitizer.sanitize(malicious)
        assert "onerror=" not in clean
    
    def test_is_safe_detects_xss(self):
        malicious = "<script>alert(1)</script>"
        assert not ContentSanitizer.is_safe(malicious)
    
    def test_safe_content(self):
        safe = "This is safe content about my experience"
        assert ContentSanitizer.is_safe(safe)
        assert ContentSanitizer.sanitize(safe) == safe

class TestOutputValidation:
    def test_valid_output(self):
        output = {
            "score": 3.5,
            "feedback": "Strong answer",
            "strengths": ["Clear", "Technical"],
            "improvements": ["Pace", "Examples"]
        }
        valid, errors = OutputValidator.validate_output(output)
        assert valid
        assert len(errors) == 0
    
    def test_invalid_score_range(self):
        output = {
            "score": 5,
            "feedback": "test",
            "strengths": [],
            "improvements": []
        }
        valid, errors = OutputValidator.validate_output(output)
        assert not valid
    
    def test_missing_required_field(self):
        output = {
            "score": 3,
            "feedback": "test"
        }
        valid, errors = OutputValidator.validate_output(output)
        assert not valid
        assert len(errors) >= 2
    
    def test_invalid_type(self):
        output = {
            "score": "not_a_number",
            "feedback": "test",
            "strengths": [],
            "improvements": []
        }
        valid, errors = OutputValidator.validate_output(output)
        assert not valid

class TestIntegration:
    def test_pipeline_initialization(self):
        pipeline = EvaluationPipeline()
        assert pipeline.interview_evaluator is not None
        assert pipeline.resume_evaluator is not None
    
    def test_full_interview_flow(self):
        pipeline = EvaluationPipeline()
        result = pipeline.evaluate_interview(
            "I led a team of 10 engineers to rebuild our infrastructure, achieving 50% performance improvement.",
            "Describe your leadership experience"
        )
        assert result.success
        assert result.data is not None
    
    def test_full_resume_flow(self):
        pipeline = EvaluationPipeline()
        resume = """
        EXPERIENCE: Senior Developer at Company - Built microservices, 60% latency reduction
        EDUCATION: MS Computer Science
        SKILLS: Python, Go, Kubernetes, PostgreSQL
        """
        result = pipeline.evaluate_resume(resume, "Backend Engineer")
        assert result.success
        assert result.data is not None

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
