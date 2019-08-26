import { connect } from 'imap-simple';

export const getInbox = async () => {
  const connection = await connect({
    imap: {
      user: '',
      password: '',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      authTimeout: 3000,
    },
  });

  await connection.openBox('INBOX');

  const results = await connection.search(['UNSEEN'], {
    bodies: ['HEADER', 'TEXT'],
    markSeen: false,
  });

  const subjects = results.map(
    res => res.parts.filter(part => part.which === 'HEADER')[0].body.subject[0]
  );

  return subjects.join('\n');
};
