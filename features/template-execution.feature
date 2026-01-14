Feature: Backstage Software Template Log Output Verification
  Verify that logs are correctly output when executing Backstage Software Template

  Background:
    Given I am logged in to Backstage

  Scenario: Execute template with group:default/admins as Owner parameter
    Given I am on the template parameter input page
    When I enter "group:default/admins" in the Owner field
    And I execute the template
    Then the log should contain "グループ名 \"admins\" を使ってリソースを作成します..."
