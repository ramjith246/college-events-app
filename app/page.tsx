'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Box, Typography, Grid, Button, Container, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface Event {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  registerLink: string;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <Container>
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h4" gutterBottom>
          College Events
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {events.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card 
              onClick={() => setSelectedEvent(event)} 
              sx={{ 
                cursor: 'pointer', 
                height: 350,  // ✅ Fixed card height
                display: 'flex', 
                flexDirection: 'column' 
              }}
            >
              <CardMedia 
                component="img" 
                height="200"  // ✅ Fixed image height
                image={event.imageUrl} 
                alt={event.name} 
                sx={{ objectFit: "cover" }} // ✅ Ensures image doesn't stretch
              />
              <CardContent sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h6" align="center">{event.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)}>
          <DialogTitle>{selectedEvent.name}</DialogTitle>
          <DialogContent sx={{ p: 0 }}> {/* ✅ Removes padding/margin */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img 
                src={selectedEvent.imageUrl} 
                alt={selectedEvent.name} 
                style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "0" }} 
              />
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1">{selectedEvent.description}</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedEvent(null)}>Close</Button>
            <Button variant="contained" color="primary" href={selectedEvent.registerLink} target="_blank" rel="noopener noreferrer">
              Register Now
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default EventsPage;
