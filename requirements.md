### Vision

- What is the vision of this product?
  Provide a interactive terminal-based application that provides users the opportunity to connect with potential partners and connect
  about the things that many back-end developers having in common, like code.

- What pain point does this project solve?
  This product makes it easy for over-worked back-end developers to connect with potential partners without having to leave their terminal.

- Why should we care about your product?
  We've never been more connected to one another. So why do many of us feel so alone?

### Scope (In/Out)

- IN - What will your product do

  - Require users to sign up and authenticate when signing in
  - Allow users to chat with other users via the terminal
  - Allow users to view potential matches and save preferred matches in their favorites
  - Allow users to engage in code challenges with matches

- OUT - What will your product not do.
  - This product will not allow users to interact using live video chat
  - This product will not provide user profile pictures

### Minimum Viable Product vs

- Users will be able to sign up and authenticate when signing in
- Users will be able to choose from an array of potential matches
- Users will be able to save potential partners to their favorites
- Users will be able to chat with other users

### Stretch Goals

- Users can leverage LiveShare or similar program to engage in code challenge activities simultaneously

### Functional Requirements

- A user can create an account by choosing a username and password
- A user can launch a search for potential matches
- A user can save select matches to their favorites
- A user can interact with other users

### Data Flow

- User signs up by launching application and creating username and password
- Upon login, server provides list of potential chat partners to users
- User engages a potential match via terminal chat window
- User may save potential match to a favorites database

### Non-Functional Requirements 

Usability

- User should be required to create username and password upon signup
- User should be required to provide username and password (or Oauth) upon signin
- User should view list of chat profiles upon signin
- User should be able to save a profile in favorites and later retrieve

Testability

- Create test that vavlidates successful database creation and contents retrieval
- Create server test that returns mock user profile
- Test two way communication between clients multiple clients via central server
- Test privacy of "chat rooms" within namespace
