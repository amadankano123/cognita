

## Plan: Fix Supervisor Messages, Add Student Messages, Restore Data Input Hub

### 1. Verify & Fix Supervisor Messages Student ID Sync

The supervisor messages in `SupervisorMessages.tsx` already use correct IDs (`stu-ug-001`, `stu-ug-002`, `stu-ug-011`, `stu-pg-001`) that match `mockSupervisedStudents`. The student names also match. This is correctly synced. No changes needed here except ensuring all 12 students appear in the contact list (currently they do via `mockSupervisedStudents`).

### 2. Add Student Messages Page with Supervisor Chat

Create a new `src/pages/app/Messages.tsx` page for the student dashboard that mirrors the supervisor messaging but from the student's perspective:

- Shows a single conversation with their assigned supervisor (Prof. Kwame Mwangi)
- Pre-populated with the same messages from `SupervisorMessages.tsx` but inverted (student sees their own messages on the right, supervisor's on the left)
- Uses `useAuth()` to determine which student is logged in and show their specific conversation
- Send message functionality included

**Routing**: Add a `/app/:projectId/messages` route in `App.tsx` and a "Messages" nav item in `AppSidebar.tsx` (using `MessageSquare` icon).

### 3. Restore Data Input Hub on DataPage

The `DataPage.tsx` currently renders `DataInputHub` which already has the three tabs (CSV/Excel, Manual Entry, Handwritten/OCR). However, the issue is `DataInputHub` checks `project.dataset.uploaded` and if true, shows only the uploaded summary instead of the input tabs.

**Fix**: Modify `DataInputHub` to add a "Re-import Data" or "Add More Data" button when data is already uploaded, so users can always access the CSV/Excel, Manual, and OCR import tabs. Alternatively, show both the summary and the import tabs.

### Technical Details

**Files to create:**
- `src/pages/app/Messages.tsx` — Student-to-supervisor chat page

**Files to modify:**
- `src/App.tsx` — Add Messages route under `/app/:projectId/messages`
- `src/components/layout/AppSidebar.tsx` — Add "Messages" nav item
- `src/components/analysis/DataInputHub.tsx` — Add button to show import tabs even when dataset is uploaded

### Shared Conversation Data

Extract conversation data to a shared location or duplicate with role-awareness. The student messages page will reference `mockSupervisorUser` for the supervisor name and filter conversations by the current student's ID from `useAuth()`.

