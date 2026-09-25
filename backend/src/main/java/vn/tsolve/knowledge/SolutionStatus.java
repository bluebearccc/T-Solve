package vn.tsolve.knowledge;

import java.util.Set;

/** DRAFT -> IN_REVIEW -> APPROVED -> PUBLISHED -> DEPRECATED -> ARCHIVED (a reviewer may send a solution back to DRAFT). */
public enum SolutionStatus {
    DRAFT, IN_REVIEW, APPROVED, PUBLISHED, DEPRECATED, ARCHIVED;

    public Set<SolutionStatus> allowedNext() {
        return switch (this) {
            case DRAFT -> Set.of(IN_REVIEW);
            case IN_REVIEW -> Set.of(APPROVED, DRAFT);
            case APPROVED -> Set.of(PUBLISHED, DRAFT);
            case PUBLISHED -> Set.of(DEPRECATED);
            case DEPRECATED -> Set.of(ARCHIVED, IN_REVIEW);
            case ARCHIVED -> Set.of();
        };
    }

    public boolean canMoveTo(SolutionStatus next) {
        return allowedNext().contains(next);
    }
}
