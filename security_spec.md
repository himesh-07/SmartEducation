# Security Specification & Test Payloads

## Data Invariants
1. A user document `/users/{userId}` can only be read or created/updated by the authenticated user matching `request.auth.uid`.
2. Notice circulars `/notices/{noticeId}` can be viewed by all authenticated users, but only authenticated teachers can publish notices.
3. Student records `/students/{studentId}` can be read by authenticated users, and modified by teachers.
4. Meeting appointment records `/meetings/{meetingId}` can be created by parents for their own requests and updated by teachers (to confirm or reschedule).

## The Dirty Dozen Test Payloads
1. **Unauthenticated Read (`/users/user123`)**: Anonymous request attempting to access user private profile. -> Expect: `PERMISSION_DENIED`
2. **Identity Spoofing on Create (`/users/targetUser`)**: Auth UID is `attackerUser`, payload attempts to set document at `/users/targetUser` with `uid: targetUser`. -> Expect: `PERMISSION_DENIED`
3. **Ghost Field Poisoning**: Payload containing extra undeclared field `isMasterAdmin: true`. -> Expect: `PERMISSION_DENIED`
4. **Oversized String Payload**: Document title containing a 2MB generated string to attempt Denial of Wallet. -> Expect: `PERMISSION_DENIED`
5. **Notice Tampering by Non-Teacher**: Unauthorized parent attempting to write/delete an official school notice. -> Expect: `PERMISSION_DENIED`
6. **Student Record Deletion by Parent**: Parent attempting to delete student records. -> Expect: `PERMISSION_DENIED`
7. **Cross-User Meeting Modification**: Parent A attempting to alter Parent B's meeting record details. -> Expect: `PERMISSION_DENIED`
8. **Malicious ID Injection**: Request targeting `/students/../special_doc` with illegal path characters. -> Expect: `PERMISSION_DENIED`
9. **Role Escalation Attack**: User attempting to self-promote from `parent` to `admin` or unverified role. -> Expect: `PERMISSION_DENIED`
10. **Blanket Query Scraping**: Query on `/users` attempting to list all user documents without filtering to own UID. -> Expect: `PERMISSION_DENIED`
11. **Spoofed Email Update**: Attempting to update a user's verified email without authentication match. -> Expect: `PERMISSION_DENIED`
12. **Status Short-Circuit**: Directly updating a meeting status without meeting ID validation. -> Expect: `PERMISSION_DENIED`
