const getMessageSections = (message:string) => {
    type ParsedMessage = {
        tags?: string,
        source?: string,
        command?: string,
        parameters?: string,
    };

    let parsedMessage:ParsedMessage = {};

    let index = 0; 
    if (message[index] === '@') {  // The message includes tags.
        let endIndex = message.indexOf(' ');
        parsedMessage.tags = message.slice(1, endIndex);
        index = endIndex + 1; // Should now point to source colon (:).
    }

    // Get the source component (nick and host) of the IRC message.
    // The idx should point to the source part; otherwise, it's a PING command.
    if (message[index] === ':') {
        index += 1;
        let endIdx = message.indexOf(' ', index);
        parsedMessage.source = message.slice(index, endIdx);
        index = endIdx + 1;  // Should point to the command part of the message.
    }

    // Get the command component of the IRC message.

    let endIdx = message.indexOf(':', index);  // Looking for the parameters part of the message.
    if (-1 === endIdx) {                      // But not all messages include the parameters part.
        endIdx = message.length;                 
    }

    parsedMessage.command = message.slice(index, endIdx).trim();

    // Get the parameters component of the IRC message.

    if (endIdx !== message.length) {  // Check if the IRC message contains a parameters component.
        index = endIdx + 1;            // Should point to the parameters part of the message.
        parsedMessage.parameters = message.slice(index);
    }

    return parsedMessage;
}

export const parseMessage = (message:string) => {
    const messageSections = getMessageSections(message);
    if (!messageSections.command) return null;
    return {
        ircCommand: messageSections.command.split(' ')[0],
        body: messageSections.parameters
    };
}