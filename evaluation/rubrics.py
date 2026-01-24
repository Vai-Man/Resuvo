from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass(frozen=True)
class Criterion:
    name: str
    weight: float
    description: str
    levels: Dict[int, str]
    
    def __post_init__(self):
        if not (0 < self.weight <= 1.0):
            raise ValueError(f"Weight must be between 0 and 1, got {self.weight}")
        if not set(self.levels.keys()) == {1, 2, 3, 4}:
            raise ValueError(f"Levels must be exactly 1-4, got {set(self.levels.keys())}")

class Rubric:
    def __init__(self, criteria: List[Criterion]):
        if not criteria:
            raise ValueError("Rubric must have at least one criterion")
        
        self.criteria = criteria
        self._validate()
    
    def _validate(self):
        total_weight = sum(c.weight for c in self.criteria)
        if abs(total_weight - 1.0) > 0.001:
            raise ValueError(f"Weights must sum to 1.0, got {total_weight}")
    
    def get_names(self) -> List[str]:
        return [c.name for c in self.criteria]
    
    def get_criterion(self, name: str) -> Criterion:
        for c in self.criteria:
            if c.name == name:
                return c
        raise ValueError(f"Criterion '{name}' not found")
    
    def calculate_score(self, scores: Dict[str, int]) -> float:
        if set(scores.keys()) != set(self.get_names()):
            raise ValueError(f"Missing scores for criteria: {set(self.get_names()) - set(scores.keys())}")
        
        total = sum(scores[c.name] * c.weight for c in self.criteria)
        return round(total, 2)

class InterviewRubric(Rubric):
    def __init__(self):
        criteria = [
            Criterion(
                name="clarity",
                weight=0.25,
                description="Communication clarity",
                levels={
                    1: "Unclear, rambling",
                    2: "Somewhat clear with unnecessary details",
                    3: "Clear and organized",
                    4: "Excellent clarity, concise"
                }
            ),
            Criterion(
                name="technical_depth",
                weight=0.25,
                description="Technical accuracy and expertise",
                levels={
                    1: "Inaccurate or missing details",
                    2: "Correct but surface-level",
                    3: "Good understanding with examples",
                    4: "Deep expertise with nuance"
                }
            ),
            Criterion(
                name="storytelling",
                weight=0.25,
                description="Narrative structure and engagement",
                levels={
                    1: "No structure, disorganized",
                    2: "Basic structure, lacks engagement",
                    3: "Well-structured with examples",
                    4: "Compelling with vivid details"
                }
            ),
            Criterion(
                name="confidence",
                weight=0.25,
                description="Confidence indicators",
                levels={
                    1: "Hesitant, filled with qualifiers",
                    2: "Somewhat confident",
                    3: "Confident, minimal hedging",
                    4: "Highly confident, authoritative"
                }
            )
        ]
        super().__init__(criteria)

class ResumeRubric(Rubric):
    def __init__(self):
        criteria = [
            Criterion(
                name="ats_compatibility",
                weight=0.20,
                description="ATS readability and keyword inclusion",
                levels={
                    1: "Poor ATS compatibility",
                    2: "Basic structure, missing sections",
                    3: "Good ATS compatibility",
                    4: "Optimized for ATS"
                }
            ),
            Criterion(
                name="achievement_quantification",
                weight=0.25,
                description="Use of metrics and measurable outcomes",
                levels={
                    1: "Generic duties without metrics",
                    2: "Some metrics but mostly vague",
                    3: "Most achievements include metrics",
                    4: "All achievements quantified with impact"
                }
            ),
            Criterion(
                name="keyword_optimization",
                weight=0.20,
                description="Industry-specific keywords",
                levels={
                    1: "Missing industry keywords",
                    2: "Few relevant keywords",
                    3: "Good keyword coverage",
                    4: "Excellent keyword density"
                }
            ),
            Criterion(
                name="structure_clarity",
                weight=0.20,
                description="Organization and readability",
                levels={
                    1: "Poorly organized",
                    2: "Basic structure, inconsistent",
                    3: "Clear structure, easy to scan",
                    4: "Excellent structure with hierarchy"
                }
            ),
            Criterion(
                name="gap_identification",
                weight=0.15,
                description="Alignment with job requirements",
                levels={
                    1: "Major gaps",
                    2: "Several gaps",
                    3: "Covers most requirements",
                    4: "Excellent alignment"
                }
            )
        ]
        super().__init__(criteria)
