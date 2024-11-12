/*************************************************************
 * Email Manager Pro - Gmail Add-on Script
 * Author: [Umair Ali]
 * Last Updated: [12-10-2024]
 *************************************************************/

// Helper function to extract email address from sender string
function extractEmailAddress(senderString) {
  var emailRegex = /<([^>]+)>/;
  var match = senderString.match(emailRegex);
  if (match && match[1]) {
    return match[1];
  } else if (senderString.includes('@')) {
    return senderString;
  } else {
    throw new Error('Invalid sender email format.');
  }
}

// Main function for contextual Gmail add-on
function getContextualAddOn(e) {
  try {
    return createMainMenuCard(e);
  } catch (error) {
    console.error('Error in getContextualAddOn:', error);
    return createErrorCard('An unexpected error occurred.');
  }
}

// Function to create the homepage when no email is selected
function getHomePage(e) {
  try {
    return createMainMenuCard(e);
  } catch (error) {
    console.error('Error in getHomePage:', error);
    return createErrorCard('An unexpected error occurred.');
  }
}

// Function to create an error card
function createErrorCard(message) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('⚠️ ' + message));

  // Back button to Main Menu
  var backButton = CardService.newTextButton()
    .setText("Back")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));

  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to create the main menu card
function createMainMenuCard(e) {
  var card = CardService.newCardBuilder();

  // Apply custom theme if any
  var userProperties = PropertiesService.getUserProperties();
  var primaryColor = userProperties.getProperty('primaryColor') || '#4285F4';
  var secondaryColor = userProperties.getProperty('secondaryColor') || '#D2E3FC';

  card.setHeader(CardService.newCardHeader()
    .setTitle("Email Manager Pro")
    .setSubtitle("Main Menu")
    .setImageUrl("https://www.example.com/logo.png") // Replace with your logo URL
    .setImageStyle(CardService.ImageStyle.CIRCLE));

  var section = CardService.newCardSection();

  // Create buttons for each main feature
  var labelManagementButton = CardService.newTextButton()
    .setText("Label Management")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showLabelManagement"));

  var emailManagementButton = CardService.newTextButton()
    .setText("Email Management")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailManagement"));

  var manageByLabelButton = CardService.newTextButton()
    .setText("Manage Emails by Label")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showManageByLabel"));

  var templatesButton = CardService.newTextButton()
    .setText("Email Templates")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailTemplates"));

  var attachmentManagerButton = CardService.newTextButton()
    .setText("Attachment Manager")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showAttachmentManager"));

  var snoozeEmailsButton = CardService.newTextButton()
    .setText("Snooze Emails")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showSnoozeEmails"));

  var advancedSearchButton = CardService.newTextButton()
    .setText("Advanced Search")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showAdvancedSearch"));

  var duplicateEmailFinderButton = CardService.newTextButton()
    .setText("Find Duplicate Emails")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("findDuplicateEmails"));

  var exportEmailsButton = CardService.newTextButton()
    .setText("Export Emails")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showExportEmails"));

  var emailSchedulerButton = CardService.newTextButton()
    .setText("Email Scheduler")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailScheduler"));

  var smartCategorizationButton = CardService.newTextButton()
    .setText("Smart Categorization")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showSmartCategorization"));

  var calendarIntegrationButton = CardService.newTextButton()
    .setText("Calendar Integration")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("createCalendarEventFromEmail"));

  var emailRemindersButton = CardService.newTextButton()
    .setText("Email Reminders")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailReminders"));

  var feedbackButton = CardService.newTextButton()
    .setText("Send Feedback")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showFeedbackForm"));

  // Add buttons to the section
  section.addWidget(labelManagementButton);
  section.addWidget(emailManagementButton);
  section.addWidget(manageByLabelButton);
  section.addWidget(templatesButton);
  section.addWidget(attachmentManagerButton);
  section.addWidget(snoozeEmailsButton);
  section.addWidget(advancedSearchButton);
  section.addWidget(duplicateEmailFinderButton);
  section.addWidget(exportEmailsButton);
  section.addWidget(emailSchedulerButton);
  section.addWidget(smartCategorizationButton);
  section.addWidget(calendarIntegrationButton);
  section.addWidget(emailRemindersButton);
  section.addWidget(feedbackButton);

  card.addSection(section);
  return card.build();
}

/* --------------------------- Complete Functions Below --------------------------- */

// ---------------- Label Management Functions ----------------

// Function to show Label Management options
function showLabelManagement(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Label Management");

  var createLabelInput = CardService.newTextInput()
    .setFieldName("labelName")
    .setTitle("Create Custom Label")
    .setHint("Enter label name");

  var createLabelButton = CardService.newTextButton()
    .setText("Create Label")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("createCustomLabel"));

  var moveEmailsButton = CardService.newTextButton()
    .setText("Move Emails from Sender to Label")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("moveEmailsFromSenderToLabel"));

  section.addWidget(createLabelInput);
  section.addWidget(createLabelButton);
  section.addWidget(moveEmailsButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));

  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to create a custom label in Gmail based on user input
function createCustomLabel(e) {
  try {
    var formInputs = e.commonEventObject.formInputs;
    var labelName = formInputs.labelName.stringInputs.value[0].trim();

    // Validate label name
    if (!labelName) {
      return createErrorCard('Please enter a valid label name.');
    }

    // Check for invalid characters
    var invalidChars = /[~#%&*{}<>?/+|\"]+/;
    if (invalidChars.test(labelName)) {
      return createErrorCard('Label name contains invalid characters.');
    }

    // Create label
    var label = GmailApp.createLabel(labelName);

    // Provide feedback to user
    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText('Label "' + labelName + '" created successfully.'));

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("showLabelManagement"));

    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in createCustomLabel:', error);
    return createErrorCard('An error occurred while creating the label.');
  }
}

// Function to move emails from sender to a specific label
function moveEmailsFromSenderToLabel(e) {
  try {
    var messageId = e.gmail.messageId;
    if (!messageId) {
      return createErrorCard('Please select an email to use this feature.');
    }
    var message = GmailApp.getMessageById(messageId);
    var sender = extractEmailAddress(message.getFrom());

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .setHeader("Move Emails from Sender to Label");

    var labelNameInput = CardService.newTextInput()
      .setFieldName("labelName")
      .setTitle("Destination Label")
      .setHint("Enter label name");

    var moveEmailsButton = CardService.newTextButton()
      .setText("Move Emails")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("confirmMoveEmailsFromSenderToLabel")
        .setParameters({ sender: sender }));

    section.addWidget(CardService.newTextParagraph()
      .setText('Move all emails from ' + sender + ' to the specified label.'));
    section.addWidget(labelNameInput);
    section.addWidget(moveEmailsButton);

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("showLabelManagement"));

    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in moveEmailsFromSenderToLabel:', error);
    return createErrorCard('An error occurred while moving emails.');
  }
}

function confirmMoveEmailsFromSenderToLabel(e) {
  try {
    var formInputs = e.commonEventObject.formInputs;
    var labelName = formInputs.labelName.stringInputs.value[0].trim();
    var sender = e.parameters.sender;

    // Validate label name
    if (!labelName) {
      return createErrorCard('Please enter a valid label name.');
    }

    var label = GmailApp.getUserLabelByName(labelName);
    if (!label) {
      label = GmailApp.createLabel(labelName);
    }

    // Search for all emails from the sender
    var threads = GmailApp.search('from:' + sender);
    var batchSize = 100;
    for (var i = 0; i < threads.length; i += batchSize) {
      var batch = threads.slice(i, i + batchSize);
      label.addToThreads(batch);
    }

    // Provide feedback to user
    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText('Moved ' + threads.length + ' emails from ' + sender + ' to label "' + labelName + '".'));

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("showLabelManagement"));

    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in confirmMoveEmailsFromSenderToLabel:', error);
    return createErrorCard('An error occurred while moving emails.');
  }
}

// ---------------- Email Management Functions ----------------

// Function to show Email Management options
function showEmailManagement(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Email Management");

  var deleteUnopenedEmailsButton = CardService.newTextButton()
    .setText("Delete Unopened Emails")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("deleteUnopenedEmailsConfirmation"));

  var archiveEmailsButton = CardService.newTextButton()
    .setText("Archive Emails from Sender")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("archiveEmailsFromSender"));

  var markEmailsReadButton = CardService.newTextButton()
    .setText("Mark Emails from Sender as Read")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("markEmailsFromSenderAsRead"));

  section.addWidget(deleteUnopenedEmailsButton);
  section.addWidget(archiveEmailsButton);
  section.addWidget(markEmailsReadButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));

  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to confirm deletion of unopened emails
function deleteUnopenedEmailsConfirmation(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Delete Unopened Emails");

  section.addWidget(CardService.newTextParagraph()
    .setText("This will delete up to 50 unopened emails from your inbox."));

  var confirmButton = CardService.newTextButton()
    .setText("Confirm Delete")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("confirmDeleteUnopenedEmails"));

  section.addWidget(confirmButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailManagement"));

  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to delete unopened emails
function confirmDeleteUnopenedEmails(e) {
  try {
    var threads = GmailApp.search('is:unread in:inbox', 0, 50); // Limit to 50 emails
    if (threads.length === 0) {
      return createErrorCard('No unopened emails found in your inbox.');
    }
    GmailApp.moveThreadsToTrash(threads);

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('Deleted ' + threads.length + ' unopened emails from your inbox.'));

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Email Management")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("showEmailManagement"));

    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in confirmDeleteUnopenedEmails:', error);
    return createErrorCard('An error occurred while deleting unopened emails.');
  }
}

// Function to archive emails from sender
function archiveEmailsFromSender(e) {
  try {
    var messageId = e.gmail.messageId;
    if (!messageId) {
      return createErrorCard('Please select an email to use this feature.');
    }
    var message = GmailApp.getMessageById(messageId);
    var sender = extractEmailAddress(message.getFrom());

    // Search for all emails from the sender
    var threads = GmailApp.search('from:' + sender);
    GmailApp.moveThreadsToArchive(threads);

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('Archived all emails from ' + sender + '.'));

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Email Management")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("showEmailManagement"));

    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in archiveEmailsFromSender:', error);
    return createErrorCard('An error occurred while archiving emails.');
  }
}

// Function to mark emails from sender as read
function markEmailsFromSenderAsRead(e) {
  try {
    var messageId = e.gmail.messageId;
    if (!messageId) {
      return createErrorCard('Please select an email to use this feature.');
    }
    var message = GmailApp.getMessageById(messageId);
    var sender = extractEmailAddress(message.getFrom());

    // Search for unread emails from the sender
    var threads = GmailApp.search('from:' + sender + ' is:unread');
    var batchSize = 100;
    for (var i = 0; i < threads.length; i += batchSize) {
      var batch = threads.slice(i, i + batchSize);
      GmailApp.markThreadsRead(batch);
    }

    // Provide feedback to user
    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText('Marked ' + threads.length + ' emails from ' + sender + ' as read.'));

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Email Management")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("showEmailManagement"));

    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in markEmailsFromSenderAsRead:', error);
    return createErrorCard('An error occurred while marking emails as read.');
  }
}

// ---------------- Manage Emails by Label Functions ----------------

// Function to show Manage Emails by Label options
function showManageByLabel(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Manage Emails by Label");

  var moveEmailsButton = CardService.newTextButton()
    .setText("Move Emails Between Labels")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("moveEmailsBetweenLabelsForm"));

  var sendEmailButton = CardService.newTextButton()
    .setText("Send Email to Label Senders")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("sendEmailToLabelSendersForm"));

  section.addWidget(moveEmailsButton);
  section.addWidget(sendEmailButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));

  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to display form for moving emails between labels
function moveEmailsBetweenLabelsForm(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Move Emails Between Labels");

  var sourceLabelInput = CardService.newTextInput()
    .setFieldName("sourceLabel")
    .setTitle("Source Label")
    .setHint("Enter source label name");

  var destinationLabelInput = CardService.newTextInput()
    .setFieldName("destinationLabel")
    .setTitle("Destination Label")
    .setHint("Enter destination label name");

  var moveEmailsButton = CardService.newTextButton()
    .setText("Move Emails")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("moveEmailsBetweenLabels"));

  section.addWidget(sourceLabelInput);
  section.addWidget(destinationLabelInput);
  section.addWidget(moveEmailsButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showManageByLabel"));

  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to move emails between labels
function moveEmailsBetweenLabels(e) {
  try {
    var formInputs = e.commonEventObject.formInputs;
    var sourceLabelName = formInputs.sourceLabel.stringInputs.value[0].trim();
    var destinationLabelName = formInputs.destinationLabel.stringInputs.value[0].trim();

    // Validate label names
    if (!sourceLabelName || !destinationLabelName) {
      return createErrorCard('Please enter valid source and destination label names.');
    }

    var sourceLabel = GmailApp.getUserLabelByName(sourceLabelName);
    var destinationLabel = GmailApp.getUserLabelByName(destinationLabelName);

    if (!sourceLabel) {
      return createErrorCard('Source label "' + sourceLabelName + '" does not exist.');
    }

    if (!destinationLabel) {
      destinationLabel = GmailApp.createLabel(destinationLabelName);
    }

    var threads = sourceLabel.getThreads();
    var batchSize = 100;
    for (var i = 0; i < threads.length; i += batchSize) {
      var batch = threads.slice(i, i + batchSize);
      destinationLabel.addToThreads(batch);
      sourceLabel.removeFromThreads(batch);
    }

    // Provide feedback to user
    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText('Moved ' + threads.length + ' emails from "' + sourceLabelName + '" to "' + destinationLabelName + '".'));

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Manage by Label")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("showManageByLabel"));

    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in moveEmailsBetweenLabels:', error);
    return createErrorCard('An error occurred while moving emails between labels.');
  }
}

// Function to display form for sending email to label senders
function sendEmailToLabelSendersForm(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Send Email to Label Senders");

  var labelInput = CardService.newTextInput()
    .setFieldName("labelName")
    .setTitle("Label Name")
    .setHint("Enter label name");

  var subjectInput = CardService.newTextInput()
    .setFieldName("emailSubject")
    .setTitle("Email Subject");

  var bodyInput = CardService.newTextInput()
    .setFieldName("emailBody")
    .setTitle("Email Body")
    .setMultiline(true);

  var sendEmailButton = CardService.newTextButton()
    .setText("Prepare Email")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("sendEmailToLabelSenders"));

  section.addWidget(labelInput);
  section.addWidget(subjectInput);
  section.addWidget(bodyInput);
  section.addWidget(sendEmailButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showManageByLabel"));

  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to send email to all unique senders of emails under a specific label
function sendEmailToLabelSenders(e) {
  try {
    var formInputs = e.commonEventObject.formInputs;
    var labelName = formInputs.labelName.stringInputs.value[0].trim();
    var emailSubject = formInputs.emailSubject.stringInputs.value[0];
    var emailBody = formInputs.emailBody.stringInputs.value[0];

    // Validate inputs
    if (!labelName || !emailSubject || !emailBody) {
      return createErrorCard('Please provide all required inputs.');
    }

    var label = GmailApp.getUserLabelByName(labelName);
    if (!label) {
      return createErrorCard('Label "' + labelName + '" does not exist.');
    }

    var threads = label.getThreads();
    var senders = {};

    // Collect unique senders
    for (var i = 0; i < threads.length; i++) {
      var messages = threads[i].getMessages();
      for (var j = 0; j < messages.length; j++) {
        var senderEmail = extractEmailAddress(messages[j].getFrom());
        senders[senderEmail] = true;
      }
    }

    var senderList = Object.keys(senders);

    if (senderList.length === 0) {
      return createErrorCard('No senders found under the label "' + labelName + '".');
    }

    // Limit the number of recipients to avoid exceeding Gmail limits
    var MAX_RECIPIENTS = 50;
    if (senderList.length > MAX_RECIPIENTS) {
      senderList = senderList.slice(0, MAX_RECIPIENTS);
    }

    // Confirmation before sending emails
    var confirmAction = CardService.newAction()
      .setFunctionName('confirmSendEmails')
      .setParameters({
        emailSubject: emailSubject,
        emailBody: emailBody,
        senders: JSON.stringify(senderList)
      });

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('You are about to send an email to ' + senderList.length + ' recipient(s) from label "' + labelName + '".'))
      .addWidget(CardService.newTextButton()
        .setText('Confirm Send')
        .setOnClickAction(confirmAction));

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("sendEmailToLabelSendersForm"));

    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in sendEmailToLabelSenders:', error);
    return createErrorCard('An error occurred while preparing to send emails.');
  }
}

// Function to confirm and send emails to the list of senders
function confirmSendEmails(e) {
  try {
    var emailSubject = e.parameters.emailSubject;
    var emailBody = e.parameters.emailBody;
    var senders = JSON.parse(e.parameters.senders);

    // Send emails
    for (var i = 0; i < senders.length; i++) {
      GmailApp.sendEmail(senders[i], emailSubject, emailBody);
    }

    // Provide feedback to user
    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText('Sent email to ' + senders.length + ' recipient(s).'));

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Main Menu")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("getHomePage"));

    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in confirmSendEmails:', error);
    return createErrorCard('An error occurred while sending emails.');
  }
}

// ---------------- Email Templates Functions ----------------

// Function to show Email Templates
function showEmailTemplates(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Email Templates");

  // List existing templates
  var templates = getEmailTemplates();
  templates.forEach(function(template) {
    var templateButton = CardService.newTextButton()
      .setText(template.name)
      .setOnClickAction(CardService.newAction()
        .setFunctionName("useEmailTemplate")
        .setParameters({ templateId: template.id }));
    section.addWidget(templateButton);
  });

  // Option to create a new template
  var createTemplateButton = CardService.newTextButton()
    .setText("Create New Template")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("createEmailTemplateForm"));
  section.addWidget(createTemplateButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to retrieve email templates
function getEmailTemplates() {
  // Retrieve templates from user properties
  var userProperties = PropertiesService.getUserProperties();
  var templatesJson = userProperties.getProperty('emailTemplates');
  var templates = templatesJson ? JSON.parse(templatesJson) : [];

  return templates;
}

// Function to display form for creating a new template
function createEmailTemplateForm(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Create New Template");

  var templateNameInput = CardService.newTextInput()
    .setFieldName("templateName")
    .setTitle("Template Name");

  var templateSubjectInput = CardService.newTextInput()
    .setFieldName("templateSubject")
    .setTitle("Email Subject");

  var templateBodyInput = CardService.newTextInput()
    .setFieldName("templateBody")
    .setTitle("Email Body")
    .setMultiline(true);

  var saveTemplateButton = CardService.newTextButton()
    .setText("Save Template")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("saveEmailTemplate"));

  section.addWidget(templateNameInput);
  section.addWidget(templateSubjectInput);
  section.addWidget(templateBodyInput);
  section.addWidget(saveTemplateButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Templates")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailTemplates"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to save the new template
function saveEmailTemplate(e) {
  var formInputs = e.commonEventObject.formInputs;
  var templateName = formInputs.templateName.stringInputs.value[0];
  var templateSubject = formInputs.templateSubject.stringInputs.value[0];
  var templateBody = formInputs.templateBody.stringInputs.value[0];

  if (!templateName || !templateSubject || !templateBody) {
    return createErrorCard('Please provide all required fields.');
  }

  var templates = getEmailTemplates();

  // Generate a unique ID for the template
  var templateId = 'template_' + new Date().getTime();

  templates.push({
    id: templateId,
    name: templateName,
    subject: templateSubject,
    body: templateBody
  });

  // Save templates back to user properties
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('emailTemplates', JSON.stringify(templates));

  // Confirmation message
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('Template "' + templateName + '" saved successfully.'));

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Templates")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailTemplates"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to use a selected template
function useEmailTemplate(e) {
  var templateId = e.parameters.templateId;
  var template = getEmailTemplates().find(function(t) {
    return t.id === templateId;
  });

  if (!template) {
    return createErrorCard('Template not found.');
  }

  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader('Use Template: ' + template.name);

  var recipientInput = CardService.newTextInput()
    .setFieldName("recipientEmail")
    .setTitle("Recipient Email");

  var subjectInput = CardService.newTextInput()
    .setFieldName("emailSubject")
    .setTitle("Email Subject")
    .setValue(template.subject);

  var bodyInput = CardService.newTextInput()
    .setFieldName("emailBody")
    .setTitle("Email Body")
    .setMultiline(true)
    .setValue(template.body);

  var sendEmailButton = CardService.newTextButton()
    .setText("Send Email")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("sendEmailFromTemplate"));

  section.addWidget(recipientInput);
  section.addWidget(subjectInput);
  section.addWidget(bodyInput);
  section.addWidget(sendEmailButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Templates")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailTemplates"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to send email using the template
function sendEmailFromTemplate(e) {
  var formInputs = e.commonEventObject.formInputs;
  var recipientEmail = formInputs.recipientEmail.stringInputs.value[0];
  var emailSubject = formInputs.emailSubject.stringInputs.value[0];
  var emailBody = formInputs.emailBody.stringInputs.value[0];

  if (!recipientEmail || !emailSubject || !emailBody) {
    return createErrorCard('Please provide all required fields.');
  }

  // Send email
  GmailApp.sendEmail(recipientEmail, emailSubject, emailBody);

  // Confirmation message
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('Email sent to ' + recipientEmail + '.'));

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Templates")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailTemplates"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

/*************************************************************
 * Email Manager Pro - Gmail Add-on Script
 * Author: [Your Name]
 * Last Updated: [Insert Date]
 *************************************************************/

// Helper function to extract email address from sender string
function extractEmailAddress(senderString) {
  var emailRegex = /<([^>]+)>/;
  var match = senderString.match(emailRegex);
  if (match && match[1]) {
    return match[1];
  } else if (senderString.includes('@')) {
    return senderString;
  } else {
    throw new Error('Invalid sender email format.');
  }
}

// Main function for contextual Gmail add-on
function getContextualAddOn(e) {
  try {
    return createMainMenuCard(e);
  } catch (error) {
    console.error('Error in getContextualAddOn:', error);
    return createErrorCard('An unexpected error occurred.');
  }
}

// Function to create the homepage when no email is selected
function getHomePage(e) {
  try {
    return createMainMenuCard(e);
  } catch (error) {
    console.error('Error in getHomePage:', error);
    return createErrorCard('An unexpected error occurred.');
  }
}

// Function to create an error card
function createErrorCard(message) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('⚠️ ' + message));

  // Back button to Main Menu
  var backButton = CardService.newTextButton()
    .setText("Back")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));

  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to create the main menu card
function createMainMenuCard(e) {
  var card = CardService.newCardBuilder();

  // Apply custom theme if any
  var userProperties = PropertiesService.getUserProperties();
  var primaryColor = userProperties.getProperty('primaryColor') || '#4285F4';
  var secondaryColor = userProperties.getProperty('secondaryColor') || '#D2E3FC';

  card.setHeader(CardService.newCardHeader()
    .setTitle("Email Manager Pro")
    .setSubtitle("Main Menu")
    .setImageUrl("https://www.example.com/logo.png") // Replace with your logo URL
    .setImageStyle(CardService.ImageStyle.CIRCLE));

  var section = CardService.newCardSection();

  // Create buttons for each main feature
  var labelManagementButton = CardService.newTextButton()
    .setText("Label Management")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showLabelManagement"));

  var emailManagementButton = CardService.newTextButton()
    .setText("Email Management")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailManagement"));

  var manageByLabelButton = CardService.newTextButton()
    .setText("Manage Emails by Label")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showManageByLabel"));

  var templatesButton = CardService.newTextButton()
    .setText("Email Templates")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailTemplates"));

  var attachmentManagerButton = CardService.newTextButton()
    .setText("Attachment Manager")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showAttachmentManager"));

  var snoozeEmailsButton = CardService.newTextButton()
    .setText("Snooze Emails")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showSnoozeEmails"));

  var advancedSearchButton = CardService.newTextButton()
    .setText("Advanced Search")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showAdvancedSearch"));

  var duplicateEmailFinderButton = CardService.newTextButton()
    .setText("Find Duplicate Emails")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("findDuplicateEmails"));

  var exportEmailsButton = CardService.newTextButton()
    .setText("Export Emails")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showExportEmails"));

  var emailSchedulerButton = CardService.newTextButton()
    .setText("Email Scheduler")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailScheduler"));

  var smartCategorizationButton = CardService.newTextButton()
    .setText("Smart Categorization")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showSmartCategorization"));

  var calendarIntegrationButton = CardService.newTextButton()
    .setText("Calendar Integration")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("createCalendarEventFromEmail"));

  var emailRemindersButton = CardService.newTextButton()
    .setText("Email Reminders")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailReminders"));

  var feedbackButton = CardService.newTextButton()
    .setText("Send Feedback")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showFeedbackForm"));

  // Add buttons to the section
  section.addWidget(labelManagementButton);
  section.addWidget(emailManagementButton);
  section.addWidget(manageByLabelButton);
  section.addWidget(templatesButton);
  section.addWidget(attachmentManagerButton);
  section.addWidget(snoozeEmailsButton);
  section.addWidget(advancedSearchButton);
  section.addWidget(duplicateEmailFinderButton);
  section.addWidget(exportEmailsButton);
  section.addWidget(emailSchedulerButton);
  section.addWidget(smartCategorizationButton);
  section.addWidget(calendarIntegrationButton);
  section.addWidget(emailRemindersButton);
  section.addWidget(feedbackButton);

  card.addSection(section);
  return card.build();
}

/* --------------------------- Complete Functions Below --------------------------- */

/* ---------------- Label Management Functions ---------------- */

// [Include the Label Management functions provided earlier]

// ... (Existing Label Management functions here)

/* ---------------- Email Management Functions ---------------- */

// [Include the Email Management functions provided earlier]

// ... (Existing Email Management functions here)

/* ---------------- Manage Emails by Label Functions ---------------- */

// [Include the Manage Emails by Label functions provided earlier]

// ... (Existing Manage Emails by Label functions here)

/* ---------------- Email Templates Functions ---------------- */

// [Include the Email Templates functions provided earlier]

// ... (Existing Email Templates functions here)

/* ---------------- Attachment Manager Functions ---------------- */

// Function to show Attachment Manager
function showAttachmentManager(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Attachment Manager");

  var listLargeAttachmentsButton = CardService.newTextButton()
    .setText("List Large Attachments")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("listLargeAttachments"));

  section.addWidget(listLargeAttachmentsButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to list emails with large attachments
function listLargeAttachments(e) {
  try {
    var threads = GmailApp.search('has:attachment larger:5MB', 0, 10); // Adjust size and limit as needed
    if (threads.length === 0) {
      return createErrorCard('No large attachments found.');
    }

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .setHeader("Large Attachments");

    threads.forEach(function(thread) {
      var message = thread.getMessages()[0];
      var subject = message.getSubject() || "(No Subject)";
      var viewButton = CardService.newTextButton()
        .setText(subject)
        .setOnClickAction(CardService.newAction()
          .setFunctionName("viewEmailAttachments")
          .setParameters({ threadId: thread.getId() }));
      section.addWidget(viewButton);
    });

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Attachment Manager")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("showAttachmentManager"));
    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in listLargeAttachments:', error);
    return createErrorCard('An error occurred while listing large attachments.');
  }
}

// Function to view attachments of an email
function viewEmailAttachments(e) {
  try {
    var threadId = e.parameters.threadId;
    var thread = GmailApp.getThreadById(threadId);
    var messages = thread.getMessages();
    var attachments = [];

    messages.forEach(function(message) {
      attachments = attachments.concat(message.getAttachments());
    });

    if (attachments.length === 0) {
      return createErrorCard('No attachments found in this email.');
    }

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .setHeader("Attachments");

    attachments.forEach(function(attachment) {
      var attachmentButton = CardService.newTextButton()
        .setText(attachment.getName())
        .setOnClickAction(CardService.newAction()
          .setFunctionName("saveAttachmentToDrive")
          .setParameters({ attachmentName: attachment.getName(), threadId: threadId }));
      section.addWidget(attachmentButton);
    });

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Large Attachments")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("listLargeAttachments"));
    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in viewEmailAttachments:', error);
    return createErrorCard('An error occurred while viewing attachments.');
  }
}

// Function to save attachment to Google Drive
function saveAttachmentToDrive(e) {
  try {
    var attachmentName = e.parameters.attachmentName;
    var threadId = e.parameters.threadId;
    var thread = GmailApp.getThreadById(threadId);
    var messages = thread.getMessages();
    var saved = false;

    messages.forEach(function(message) {
      var attachments = message.getAttachments();
      attachments.forEach(function(attachment) {
        if (attachment.getName() === attachmentName) {
          // Save to Drive
          var file = DriveApp.createFile(attachment);
          saved = true;
        }
      });
    });

    if (!saved) {
      return createErrorCard('Attachment not found.');
    }

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('Attachment "' + attachmentName + '" saved to Google Drive.'));

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Attachments")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("viewEmailAttachments")
        .setParameters({ threadId: threadId }));
    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in saveAttachmentToDrive:', error);
    return createErrorCard('An error occurred while saving attachment.');
  }
}

/* ---------------- Snooze Emails Functions ---------------- */

// Function to show Snooze Emails
function showSnoozeEmails(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Snooze Emails");

  var messageId = e.gmail && e.gmail.messageId;
  if (messageId) {
    var snoozeButton = CardService.newTextButton()
      .setText("Snooze This Email")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("snoozeCurrentEmail")
        .setParameters({ messageId: messageId }));
    section.addWidget(snoozeButton);
  } else {
    section.addWidget(CardService.newTextParagraph()
      .setText("Please select an email to snooze."));
  }

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

function snoozeCurrentEmail(e) {
  try {
    var messageId = e.parameters.messageId;
    var message = GmailApp.getMessageById(messageId);
    var thread = message.getThread();

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .setHeader("Snooze Email");

    var snoozeDurationInput = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.DROPDOWN)
      .setTitle("Snooze Duration")
      .setFieldName("snoozeDuration")
      .addItem("1 Hour", "1h", true)
      .addItem("3 Hours", "3h", false)
      .addItem("1 Day", "1d", false)
      .addItem("3 Days", "3d", false);

    var confirmSnoozeButton = CardService.newTextButton()
      .setText("Confirm Snooze")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("confirmSnooze")
        .setParameters({ threadId: thread.getId() }));

    section.addWidget(snoozeDurationInput);
    section.addWidget(confirmSnoozeButton);

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("showSnoozeEmails"));
    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in snoozeCurrentEmail:', error);
    return createErrorCard('An error occurred while initiating snooze.');
  }
}

function confirmSnooze(e) {
  try {
    var formInputs = e.commonEventObject.formInputs;
    var snoozeDuration = formInputs.snoozeDuration.stringInputs.value[0];
    var threadId = e.parameters.threadId;
    var thread = GmailApp.getThreadById(threadId);

    // Move the thread out of the inbox
    thread.moveToArchive();

    // Set a snooze label with a timestamp (simplified implementation)
    var snoozeLabelName = 'Snoozed/' + new Date().getTime();
    var snoozeLabel = GmailApp.createLabel(snoozeLabelName);
    snoozeLabel.addToThread(thread);

    // Schedule a time-based trigger to bring the email back
    var durationMs = getSnoozeDurationInMs(snoozeDuration);
    ScriptApp.newTrigger('unsnoozeEmail')
      .timeBased()
      .after(durationMs)
      .create();

    // Store thread ID and label in user properties
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('snoozedThread_' + threadId, snoozeLabelName);

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('Email snoozed for ' + snoozeDuration + '.'));

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Main Menu")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("getHomePage"));
    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in confirmSnooze:', error);
    return createErrorCard('An error occurred while confirming snooze.');
  }
}

// Helper function to get snooze duration in milliseconds
function getSnoozeDurationInMs(duration) {
  switch (duration) {
    case '1h':
      return 1 * 60 * 60 * 1000;
    case '3h':
      return 3 * 60 * 60 * 1000;
    case '1d':
      return 24 * 60 * 60 * 1000;
    case '3d':
      return 3 * 24 * 60 * 60 * 1000;
    default:
      return 1 * 60 * 60 * 1000;
  }
}

// Function to unsnooze email
function unsnoozeEmail() {
  var userProperties = PropertiesService.getUserProperties();
  var snoozedThreads = userProperties.getProperties();

  for (var key in snoozedThreads) {
    if (key.startsWith('snoozedThread_')) {
      var threadId = key.replace('snoozedThread_', '');
      var labelName = snoozedThreads[key];
      var thread = GmailApp.getThreadById(threadId);
      var label = GmailApp.getUserLabelByName(labelName);

      if (thread && label) {
        thread.moveToInbox();
        label.removeFromThread(thread);
        GmailApp.refreshThread(thread);
      }

      // Remove property
      userProperties.deleteProperty(key);
    }
  }
}

/* ---------------- Advanced Search Functions ---------------- */

// Function to show Advanced Search
function showAdvancedSearch(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Advanced Search");

  var searchQueryInput = CardService.newTextInput()
    .setFieldName("searchQuery")
    .setTitle("Enter Advanced Search Query")
    .setHint("e.g., has:attachment from:example@example.com");

  var performSearchButton = CardService.newTextButton()
    .setText("Search Emails")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("performAdvancedSearch"));

  section.addWidget(searchQueryInput);
  section.addWidget(performSearchButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

function performAdvancedSearch(e) {
  try {
    var formInputs = e.commonEventObject.formInputs;
    var query = formInputs.searchQuery.stringInputs.value[0].trim();

    if (!query) {
      return createErrorCard('Please enter a search query.');
    }

    var threads = GmailApp.search(query, 0, 10); // Limit to 10 results

    if (threads.length === 0) {
      return createErrorCard('No emails found matching the search query.');
    }

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .setHeader("Search Results");

    threads.forEach(function(thread) {
      var message = thread.getMessages()[0];
      var subject = message.getSubject() || "(No Subject)";
      var emailButton = CardService.newTextButton()
        .setText(subject)
        .setOpenLink(CardService.newOpenLink()
          .setUrl('https://mail.google.com/mail/u/0/#inbox/' + thread.getId()));
      section.addWidget(emailButton);
    });

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Advanced Search")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("showAdvancedSearch"));
    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in performAdvancedSearch:', error);
    return createErrorCard('An error occurred while performing the search.');
  }
}

/* ---------------- Find Duplicate Emails Functions ---------------- */

// Function to find Duplicate Emails
function findDuplicateEmails(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Find Duplicate Emails");

  var dateRangeInput = CardService.newTextInput()
    .setFieldName("duplicateEmailDateRange")
    .setTitle("Enter Time Period")
    .setHint("e.g., newer_than:1y");

  var findDuplicatesButton = CardService.newTextButton()
    .setText("Find Duplicates")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("performFindDuplicateEmails"));

  section.addWidget(dateRangeInput);
  section.addWidget(findDuplicatesButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

function performFindDuplicateEmails(e) {
  try {
    var formInputs = e.commonEventObject.formInputs;
    var dateRange = formInputs.duplicateEmailDateRange.stringInputs.value[0].trim();
    var searchQuery = 'in:all';
    if (dateRange) {
      searchQuery += ' ' + dateRange;
    }

    var threads = GmailApp.search(searchQuery, 0, 100); // Limit to 100 threads
    var messageIds = {};
    var duplicates = [];

    threads.forEach(function(thread) {
      var messages = thread.getMessages();
      messages.forEach(function(message) {
        var msgId = message.getHeader('Message-ID');
        if (messageIds[msgId]) {
          duplicates.push(thread);
        } else {
          messageIds[msgId] = true;
        }
      });
    });

    if (duplicates.length === 0) {
      return createErrorCard('No duplicate emails found.');
    }

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .setHeader("Duplicate Emails");

    duplicates.forEach(function(thread) {
      var subject = thread.getFirstMessageSubject() || "(No Subject)";
      var deleteButton = CardService.newTextButton()
        .setText("Delete Duplicate: " + subject)
        .setOnClickAction(CardService.newAction()
          .setFunctionName("deleteDuplicateEmail")
          .setParameters({ threadId: thread.getId() }));
      section.addWidget(deleteButton);
    });

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Main Menu")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("getHomePage"));
    section.addWidget(backButton);

    card.addSection(section);
    return card.build();

  } catch (error) {
    console.error('Error in performFindDuplicateEmails:', error);
    return createErrorCard('An error occurred while finding duplicates.');
  }
}

function deleteDuplicateEmail(e) {
  try {
    var threadId = e.parameters.threadId;
    var thread = GmailApp.getThreadById(threadId);
    thread.moveToTrash();

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('Duplicate email deleted.'));

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Duplicate Emails")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("findDuplicateEmails"));
    section.addWidget(backButton);

    card.addSection(section);
    return card.build();

  } catch (error) {
    console.error('Error in deleteDuplicateEmail:', error);
    return createErrorCard('An error occurred while deleting duplicate email.');
  }
}

/* ---------------- Export Emails Functions ---------------- */

// Function to show Export Emails
function showExportEmails(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Export Emails");

  var exportQueryInput = CardService.newTextInput()
    .setFieldName("exportQuery")
    .setTitle("Gmail Search Query")
    .setHint("e.g., label:inbox is:unread");

  var exportEmailsButton = CardService.newTextButton()
    .setText("Export Emails")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("exportEmails"));

  section.addWidget(exportQueryInput);
  section.addWidget(exportEmailsButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

function exportEmails(e) {
  try {
    var formInputs = e.commonEventObject.formInputs;
    var query = formInputs.exportQuery.stringInputs.value[0].trim();

    if (!query) {
      return createErrorCard('Please enter a search query.');
    }

    var threads = GmailApp.search(query, 0, 20); // Limit to 20 threads
    if (threads.length === 0) {
      return createErrorCard('No emails found matching the search query.');
    }

    var csvContent = 'Date,From,Subject,Snippet\n';

    threads.forEach(function(thread) {
      var message = thread.getMessages()[0];
      var date = message.getDate();
      var from = message.getFrom().replace(/"/g, '""');
      var subject = (message.getSubject() || '').replace(/"/g, '""');
      var snippet = message.getPlainBody().substring(0, 100).replace(/\n/g, ' ').replace(/,/g, ';').replace(/"/g, '""');
      csvContent += '"' + date + '","' + from + '","' + subject + '","' + snippet + '"\n';
    });

    // Save CSV to Drive
    var file = DriveApp.createFile('Email Export.csv', csvContent, MimeType.PLAIN_TEXT);

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('Emails exported to Google Drive: '))
      .addWidget(CardService.newTextButton()
        .setText('Open File')
        .setOpenLink(CardService.newOpenLink()
          .setUrl(file.getUrl())));

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Export Emails")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("showExportEmails"));
    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in exportEmails:', error);
    return createErrorCard('An error occurred while exporting emails.');
  }
}

/* ---------------- Email Scheduler Functions ---------------- */

// Function to show Email Scheduler
function showEmailScheduler(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Email Scheduler");

  var recipientInput = CardService.newTextInput()
    .setFieldName("recipientEmail")
    .setTitle("Recipient Email");

  var subjectInput = CardService.newTextInput()
    .setFieldName("emailSubject")
    .setTitle("Email Subject");

  var bodyInput = CardService.newTextInput()
    .setFieldName("emailBody")
    .setTitle("Email Body")
    .setMultiline(true);

  var dateInput = CardService.newTextInput()
    .setFieldName("scheduledDate")
    .setTitle("Scheduled Date and Time")
    .setHint("MM/DD/YYYY HH:MM (24-hour format)");

  var scheduleEmailButton = CardService.newTextButton()
    .setText("Schedule Email")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("confirmScheduleEmail"));

  section.addWidget(recipientInput);
  section.addWidget(subjectInput);
  section.addWidget(bodyInput);
  section.addWidget(dateInput);
  section.addWidget(scheduleEmailButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

function confirmScheduleEmail(e) {
  var formInputs = e.commonEventObject.formInputs;
  var recipientEmail = formInputs.recipientEmail.stringInputs.value[0];
  var emailSubject = formInputs.emailSubject.stringInputs.value[0];
  var emailBody = formInputs.emailBody.stringInputs.value[0];
  var scheduledDate = formInputs.scheduledDate.stringInputs.value[0];

  if (!recipientEmail || !emailSubject || !emailBody || !scheduledDate) {
    return createErrorCard('Please provide all required fields.');
  }

  // Parse date
  var date = new Date(scheduledDate);
  if (isNaN(date.getTime())) {
    return createErrorCard('Invalid date format.');
  }

  // Schedule email
  var trigger = ScriptApp.newTrigger('sendScheduledEmail')
    .timeBased()
    .at(date)
    .create();

  // Store email details in user properties
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('scheduledEmail_' + trigger.getUniqueId(), JSON.stringify({
    recipientEmail: recipientEmail,
    emailSubject: emailSubject,
    emailBody: emailBody
  }));

  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('Email scheduled to be sent on ' + scheduledDate + '.'));

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Email Scheduler")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailScheduler"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

function sendScheduledEmail(e) {
  var triggerId = e.triggerUid;
  var userProperties = PropertiesService.getUserProperties();
  var emailDetailsJson = userProperties.getProperty('scheduledEmail_' + triggerId);

  if (emailDetailsJson) {
    var emailDetails = JSON.parse(emailDetailsJson);
    GmailApp.sendEmail(emailDetails.recipientEmail, emailDetails.emailSubject, emailDetails.emailBody);
    userProperties.deleteProperty('scheduledEmail_' + triggerId);
  }

  // Delete the trigger
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    if (allTriggers[i].getUniqueId() === triggerId) {
      ScriptApp.deleteTrigger(allTriggers[i]);
      break;
    }
  }
}

/* ---------------- Smart Email Categorization Functions ---------------- */

// Function to show Smart Categorization
function showSmartCategorization(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Smart Email Categorization");

  var senderInput = CardService.newTextInput()
    .setFieldName("senderEmail")
    .setTitle("Sender Email");

  var labelInput = CardService.newTextInput()
    .setFieldName("labelName")
    .setTitle("Label Name");

  var addRuleButton = CardService.newTextButton()
    .setText("Add Categorization Rule")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("addCategorizationRule"));

  section.addWidget(senderInput);
  section.addWidget(labelInput);
  section.addWidget(addRuleButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

function addCategorizationRule(e) {
  var formInputs = e.commonEventObject.formInputs;
  var senderEmail = formInputs.senderEmail.stringInputs.value[0];
  var labelName = formInputs.labelName.stringInputs.value[0];

  if (!senderEmail || !labelName) {
    return createErrorCard('Please provide both sender email and label name.');
  }

  var userProperties = PropertiesService.getUserProperties();
  var rulesJson = userProperties.getProperty('categorizationRules');
  var rules = rulesJson ? JSON.parse(rulesJson) : [];

  rules.push({
    senderEmail: senderEmail,
    labelName: labelName
  });

  userProperties.setProperty('categorizationRules', JSON.stringify(rules));

  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('Categorization rule added for sender ' + senderEmail + ' to label ' + labelName + '.'));

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Smart Categorization")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showSmartCategorization"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to apply categorization rules (to be called periodically)
function applyCategorizationRules() {
  var userProperties = PropertiesService.getUserProperties();
  var rulesJson = userProperties.getProperty('categorizationRules');
  var rules = rulesJson ? JSON.parse(rulesJson) : [];

  rules.forEach(function(rule) {
    var threads = GmailApp.search('from:' + rule.senderEmail + ' -label:' + rule.labelName);
    var label = GmailApp.getUserLabelByName(rule.labelName) || GmailApp.createLabel(rule.labelName);
    if (threads.length > 0) {
      label.addToThreads(threads);
    }
  });
}

/* ---------------- Calendar Integration Functions ---------------- */

// Function to create Calendar Event from Email
function createCalendarEventFromEmail(e) {
  try {
    var messageId = e.gmail.messageId;
    if (!messageId) {
      return createErrorCard('Please select an email to use this feature.');
    }
    var message = GmailApp.getMessageById(messageId);
    var subject = message.getSubject() || 'New Event';
    var body = message.getPlainBody();

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .setHeader("Create Calendar Event");

    var eventTitleInput = CardService.newTextInput()
      .setFieldName("eventTitle")
      .setTitle("Event Title")
      .setValue(subject);

    var eventDescriptionInput = CardService.newTextInput()
      .setFieldName("eventDescription")
      .setTitle("Event Description")
      .setMultiline(true)
      .setValue(body);

    var eventDateInput = CardService.newTextInput()
      .setFieldName("eventDate")
      .setTitle("Event Date")
      .setHint("MM/DD/YYYY");

    var eventTimeInput = CardService.newTextInput()
      .setFieldName("eventTime")
      .setTitle("Event Time")
      .setHint("HH:MM (24-hour format)");

    var createEventButton = CardService.newTextButton()
      .setText("Create Event")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("confirmCreateCalendarEvent"));

    section.addWidget(eventTitleInput);
    section.addWidget(eventDescriptionInput);
    section.addWidget(eventDateInput);
    section.addWidget(eventTimeInput);
    section.addWidget(createEventButton);

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Main Menu")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("getHomePage"));
    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in createCalendarEventFromEmail:', error);
    return createErrorCard('An error occurred while preparing to create calendar event.');
  }
}

function confirmCreateCalendarEvent(e) {
  var formInputs = e.commonEventObject.formInputs;
  var eventTitle = formInputs.eventTitle.stringInputs.value[0];
  var eventDescription = formInputs.eventDescription.stringInputs.value[0];
  var eventDate = formInputs.eventDate.stringInputs.value[0];
  var eventTime = formInputs.eventTime.stringInputs.value[0];

  if (!eventTitle || !eventDate || !eventTime) {
    return createErrorCard('Please provide event title, date, and time.');
  }

  var eventDateTime = new Date(eventDate + ' ' + eventTime);
  if (isNaN(eventDateTime.getTime())) {
    return createErrorCard('Invalid date or time format.');
  }

  // Create calendar event
  CalendarApp.createEvent(eventTitle, eventDateTime, eventDateTime, {
    description: eventDescription
  });

  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('Calendar event "' + eventTitle + '" created successfully.'));

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Calendar Integration")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("createCalendarEventFromEmail"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

/* ---------------- Customizable Interface Functions ---------------- */

// Function to apply custom theme
function applyCustomTheme(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Customize Interface");

  var primaryColorInput = CardService.newTextInput()
    .setFieldName("primaryColor")
    .setTitle("Primary Color")
    .setHint("#4285F4");

  var secondaryColorInput = CardService.newTextInput()
    .setFieldName("secondaryColor")
    .setTitle("Secondary Color")
    .setHint("#D2E3FC");

  var saveThemeButton = CardService.newTextButton()
    .setText("Save Theme")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("saveCustomTheme"));

  section.addWidget(primaryColorInput);
  section.addWidget(secondaryColorInput);
  section.addWidget(saveThemeButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to save custom theme
function saveCustomTheme(e) {
  var formInputs = e.commonEventObject.formInputs;
  var primaryColor = formInputs.primaryColor.stringInputs.value[0];
  var secondaryColor = formInputs.secondaryColor.stringInputs.value[0];

  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('primaryColor', primaryColor);
  userProperties.setProperty('secondaryColor', secondaryColor);

  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('Theme updated successfully.'));

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Customize Interface")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("applyCustomTheme"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

/* ---------------- Email Reminders Functions ---------------- */

// Function to show Email Reminders
function showEmailReminders(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Email Reminders");

  var messageId = e.gmail && e.gmail.messageId;
  if (messageId) {
    var reminderButton = CardService.newTextButton()
      .setText("Set Reminder for This Email")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("setEmailReminder")
        .setParameters({ messageId: messageId }));
    section.addWidget(reminderButton);
  } else {
    section.addWidget(CardService.newTextParagraph()
      .setText("Please select an email to set a reminder."));
  }

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

function setEmailReminder(e) {
  try {
    var messageId = e.parameters.messageId;

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .setHeader("Set Email Reminder");

    var reminderDateInput = CardService.newTextInput()
      .setFieldName("reminderDate")
      .setTitle("Reminder Date and Time")
      .setHint("MM/DD/YYYY HH:MM (24-hour format)");

    var confirmReminderButton = CardService.newTextButton()
      .setText("Set Reminder")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("confirmSetEmailReminder")
        .setParameters({ messageId: messageId }));

    section.addWidget(reminderDateInput);
    section.addWidget(confirmReminderButton);

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Email Reminders")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("showEmailReminders"));
    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in setEmailReminder:', error);
    return createErrorCard('An error occurred while setting email reminder.');
  }
}

function confirmSetEmailReminder(e) {
  var formInputs = e.commonEventObject.formInputs;
  var reminderDate = formInputs.reminderDate.stringInputs.value[0];
  var messageId = e.parameters.messageId;

  if (!reminderDate) {
    return createErrorCard('Please provide a valid date and time.');
  }

  var date = new Date(reminderDate);
  if (isNaN(date.getTime())) {
    return createErrorCard('Invalid date format.');
  }

  // Schedule reminder
  var trigger = ScriptApp.newTrigger('sendEmailReminder')
    .timeBased()
    .at(date)
    .create();

  // Store reminder details in user properties
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('emailReminder_' + trigger.getUniqueId(), JSON.stringify({
    messageId: messageId
  }));

  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('Reminder set for ' + reminderDate + '.'));

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Email Reminders")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showEmailReminders"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

function sendEmailReminder(e) {
  var triggerId = e.triggerUid;
  var userProperties = PropertiesService.getUserProperties();
  var reminderDetailsJson = userProperties.getProperty('emailReminder_' + triggerId);

  if (reminderDetailsJson) {
    var reminderDetails = JSON.parse(reminderDetailsJson);
    var messageId = reminderDetails.messageId;
    var message = GmailApp.getMessageById(messageId);

    // Send reminder email to self
    var subject = "Email Reminder: " + (message.getSubject() || "(No Subject)");
    var body = "This is a reminder for the following email:\n\n" + message.getPlainBody();

    GmailApp.sendEmail(Session.getActiveUser().getEmail(), subject, body);

    userProperties.deleteProperty('emailReminder_' + triggerId);
  }

  // Delete the trigger
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    if (allTriggers[i].getUniqueId() === triggerId) {
      ScriptApp.deleteTrigger(allTriggers[i]);
      break;
    }
  }
}

/* ---------------- Feedback Form Functions ---------------- */

// Function to show the feedback form
function showFeedbackForm(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection()
    .setHeader("Send Feedback");

  var feedbackInput = CardService.newTextInput()
    .setFieldName("userFeedback")
    .setTitle("Your Feedback")
    .setMultiline(true)
    .setHint("Enter your comments, suggestions, or report issues here.");

  var sendFeedbackButton = CardService.newTextButton()
    .setText("Submit Feedback")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("submitFeedback"));

  section.addWidget(feedbackInput);
  section.addWidget(sendFeedbackButton);

  // Back button
  var backButton = CardService.newTextButton()
    .setText("Back to Main Menu")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("getHomePage"));
  section.addWidget(backButton);

  card.addSection(section);
  return card.build();
}

// Function to submit the feedback
function submitFeedback(e) {
  try {
    var formInputs = e.commonEventObject.formInputs;
    var userFeedback = formInputs.userFeedback.stringInputs.value[0];

    if (!userFeedback) {
      return createErrorCard('Please enter your feedback before submitting.');
    }

    // Send the feedback via email
    var recipientEmail = "malik.ali642@gmail.com"; // Replace with your actual email address
    var subject = "Feedback from Email Manager Pro User";
    var userEmail = Session.getActiveUser().getEmail();
    var messageBody = "Feedback from: " + userEmail + "\n\n" + userFeedback;

    GmailApp.sendEmail(recipientEmail, subject, messageBody);

    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('Thank you for your feedback!'));

    // Back button
    var backButton = CardService.newTextButton()
      .setText("Back to Main Menu")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("getHomePage"));
    section.addWidget(backButton);

    card.addSection(section);
    return card.build();
  } catch (error) {
    console.error('Error in submitFeedback:', error);
    return createErrorCard('An error occurred while submitting your feedback.');
  }
}

/* --------------------------- End of Script --------------------------- */