import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';

interface ConversationEntry {
  role: 'user' | 'historicalFigure';
  content: string;
}

const styles = {
  terminal: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    fontFamily: "'Courier New', monospace",
    // padding: '10px',
    leftPadding: '10px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    // minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  terminalWindow: {
    // maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  inputArea: {
    display: 'flex',
    alignItems: 'center',
  },
  prompt: {
    marginRight: '10px',
  },
  inputField: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontFamily: "'Courier New', monospace",
    fontSize: '16px',
    outline: 'none',
    caretColor: 'transparent', // Hide the default cursor
    padding: '0',
    width: '100%',
  },
  blockCursor: {
    display: 'inline-block',
    width: '10px',
    height: '16px',
    backgroundColor: '#ffffff',
    animation: 'blink 1s step-end infinite'
  },
  conversationHistory: {
    marginTop: '20px',
  },
  message: {
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    backgroundColor: '#252526',
  },
  user: {
    textAlign: 'left',
    color: '#ffffff',
  },
  historicalFigure: {
    textAlign: 'left',
    color: '#ffffff',
  },
};

function ChrisAI() {
  const [figureName, setFigureName] = useState('');
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversationHistory]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!figureName) return;

    try {
      const response = await axios.post('https://elder-comp-server-8e643edb1bd8.herokuapp.com/transcribe-text-with-chrisai', {
        transcript: figureName,
        figure: figureName
      });

      setConversationHistory(prevHistory => [
        ...prevHistory,
        { role: 'user', content: figureName },
        { role: 'historicalFigure', content: response.data.response }
      ]);

      setFigureName('');
    } catch (error) { 
      console.error('Error sending transcript to server:', error);
    }
  };

  return (
    <Box>
      <Grid container direction="column">
        <Grid item xs={12} sx={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontFamily: "'Courier New', monospace", padding: '40px 0 20px 0' }}>
            Bot version
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "'Courier New', monospace", padding: '20px 0 40px 0' }}>
            This bot knows some interesting info about Chris - you can ask about his career, education, personal life, or anything else!
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ flex: 1, textAlign: 'center' }}>
          <div style={{ ...styles.terminal, minHeight: '30vh' }} className="App"> {/* Adjusted line */}
            <div style={styles.terminalWindow}>
              <div style={styles.conversationHistory}>
                {conversationHistory.map((entry, index) => (
                  (entry.role === 'user') ? (

                  <div key={index} style={{...styles.message, ...(entry.role === 'user' ? styles.user : styles.historicalFigure)}}>
                    <div style={styles.prompt}></div>
                    chris_ai % {entry.content}
                  </div>
                ) : (
                  <div key={index} style={{...styles.message, ...(entry.role === 'historicalFigure' ? styles.historicalFigure : styles.user)}}>
                    {entry.content}
                  </div>
                )
                )
                )

              }
              </div>
              <form onSubmit={handleSubmit} style={styles.inputArea}>
                <div style={styles.prompt}>chris_ai %</div>
                {!isMobile ? (
                <input
                  ref={inputRef}
                  style={styles.inputField}
                  type="text"
                  name="figureName"
                  placeholder="Query ChrisAI a question about his past experiences"
                  value={figureName}
                  onChange={(e) => setFigureName(e.target.value)}
                  autoFocus
                />
                ) : (
                  <input
                  ref={inputRef}
                  style={styles.inputField}
                  type="text"
                  name="figureName"
                  placeholder="Query ChrisAI"
                  value={figureName}
                  onChange={(e) => setFigureName(e.target.value)}
                  autoFocus
                />
                )}
                {/* <span style={styles.blockCursor}></span>  // This span acts as the block cursor */}
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChrisAI;
