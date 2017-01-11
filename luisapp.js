var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://api.projectoxford.ai/luis/v2.0/apps/dbd49d48-d7eb-4ff4-ab22-acdfb3ad4717?subscription-key=c48fa2d004fb417d871c66b4d21c2f7f';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

// dialog.matches('AutomationAdvice', builder.DialogAction.send('Recommending Automation'));
dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand"));

// Add intent handlers
dialog.matches('AutomationAdvice', [

    function (session, args, next) {
        // Resolve and store any entities passed from LUIS.
        var automationPurpose = builder.EntityRecognizer.findEntity(args.entities, 'AutomationPurpose');
        
        var purpose = automationPurpose.entity;

        session.send("You have requested automation offerings for " + purpose + "activity. Let me identify the best-fit Automation Offering..");

       var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))
            ]);
        session.send(msg);
    }

]);

dialog.matches('CollaborationAdvice', [

    function (session, args, next) {
        // Resolve and store any entities passed from LUIS.
        var collaborationPurpose = builder.EntityRecognizer.findEntity(args.entities, 'CollaborationPurpose');
    

       var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))
            ]);
        session.send(msg);
    }

]);




server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

//bot.dialog('/', function (session) {
  //  session.send("Hello World");
// });

