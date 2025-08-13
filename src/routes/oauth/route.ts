// src/routes/oauth.route.ts
import express from 'express';
import fetch from 'node-fetch';
import { google } from 'googleapis';
import { getConfig } from '../../config/env';

const googleClientId = getConfig('GOOGLE_CLIENT_ID')
const googleSecret = getConfig('GOOGLE_CLIENT_SECRET')
const googleOAuthURI = getConfig('GOOGLE_OAUTH_REDIRECT_URI')

const router = express.Router();

router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send('Missing code');

  try {
    const resp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleSecret,
        redirect_uri: googleOAuthURI,
        grant_type: 'authorization_code'
      })
    });
    const data = await resp.json();
    console.log('Tokens:', data); // acces_token, refresh_token

    // Mostramos al usuario, pero guardalo de forma segura en prod
    return res.json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Token exchange failed' });
  }
});

export default router;
