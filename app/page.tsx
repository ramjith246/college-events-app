'use client';

import React, { useEffect, useState } from 'react';
import { db1, db2 } from '@/lib/firebase'; // Import both database instances
import { collection, getDocs } from 'firebase/firestore';
import { Box, Typography, Grid, Button, Container, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Image from "next/image";
import Head from 'next/head';

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
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(collection(db1, 'events')),
      getDocs(collection(db2, 'events'))
    ]);

    // Debugging: Log fetched data
    console.log("Events from DB1:", snapshot1.docs.map(doc => doc.data()));
    console.log("Events from DB2:", snapshot2.docs.map(doc => doc.data()));

    const events1 = snapshot1.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      imageUrl: doc.data().imageUrl,
      description: doc.data().description || "No description available",
      registerLink: doc.data().registerLink || "#"
    }));

    const events2 = snapshot2.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      imageUrl: doc.data().imageUrl,
      description: doc.data().description || doc.data().desc || "No description available",
      registerLink: doc.data().registerLink || "#"
    }));

    setEvents([...events1, ...events2]);
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

    
    fetchEvents();
  }, []);

  return (
    <Container>
      {/* PWA Metadata */}
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1976d2" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>

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
              sx={{ cursor: 'pointer', height: 350, display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia 
                component="img" 
                height="200"
                image={event.imageUrl} 
                alt={event.name} 
                sx={{ objectFit: "cover" }}
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
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Image 
                src={selectedEvent.imageUrl} 
                alt={selectedEvent.name} 
                width={800}
                height={600}
                unoptimized
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
