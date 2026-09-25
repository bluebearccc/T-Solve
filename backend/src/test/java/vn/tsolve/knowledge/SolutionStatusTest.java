package vn.tsolve.knowledge;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import vn.tsolve.common.error.BusinessRuleException;

class SolutionStatusTest {

    @Test
    void happyPathReachesPublished() {
        Solution s = new Solution(1L, "403 after role change");
        s.transitionTo(SolutionStatus.IN_REVIEW);
        s.transitionTo(SolutionStatus.APPROVED);
        s.transitionTo(SolutionStatus.PUBLISHED);
        assertEquals(SolutionStatus.PUBLISHED, s.getStatus());
    }

    @Test
    void draftCannotBePublishedDirectly() {
        Solution s = new Solution(1L, "x");
        assertThrows(BusinessRuleException.class, () -> s.transitionTo(SolutionStatus.PUBLISHED));
    }

    @Test
    void archivedIsTerminal() {
        assertTrue(SolutionStatus.ARCHIVED.allowedNext().isEmpty());
    }
}
