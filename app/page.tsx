'use client';

import React, { useEffect, useState } from 'react';
import { db1, db2 } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Box, Typography, Grid, Button, Container, Card, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import Image from "next/image";
import Head from 'next/head';
import MenuIcon from '@mui/icons-material/Menu'; // Import the hamburger menu icon

interface Event {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  registerLink: string;
  date: string;
  status?: string;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // State to manage drawer open/close

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [snapshot1, snapshot2] = await Promise.all([
          getDocs(collection(db1, 'events')),
          getDocs(collection(db2, 'events'))
        ]);

        const events1 = snapshot1.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          description: doc.data().description || "No description available",
          registerLink: doc.data().registerLink || "#",
          date: doc.data().date || "Date not available",
          status: doc.data().status || "active"
        }));

        const events2 = snapshot2.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          description: doc.data().description || doc.data().desc || "No description available",
          registerLink: doc.data().registerLink || "#",
          date: doc.data().date || "Date not available",
          status: doc.data().status || "active"
        }));

        setEvents([...events1, ...events2]);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <Container>
      {/* PWA Metadata */}
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1976d2" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>

      {/* Hamburger Menu Button */}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }}
      >
        <MenuIcon sx={{ color: 'white', fontSize: '2rem' }} /> {/* Three white lines */}
      </IconButton>

      {/* Drawer (Sliding Panel) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem  component="a" href="/">
                          <ListItemText primary="Events" />
                        </ListItem>
                        <ListItem  component="a" href="/internships">
                          <ListItemText primary="Internships" />
                        </ListItem>
                        <ListItem  component="a" href="/FestsPage">
                          <ListItemText primary="Fests" />
                        </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ fontFamily: '"Old Standard TT", serif' }}
        >
          Events GEC
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {events.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card 
              onClick={() => setSelectedEvent(event)} 
              sx={{ 
                cursor: 'pointer', 
                height: 350, 
                display: 'flex', 
                flexDirection: 'column',
                filter: event.status === "canceled" ? "grayscale(100%)" : "none", 
                opacity: event.status === "canceled" ? 0.6 : 1,
                position: 'relative' // Needed for overlay
              }}
            >
              <CardMedia 
                component="img" 
                height="200"
                image={event.imageUrl} 
                alt={event.name} 
                sx={{ objectFit: "cover" }}
              />
             

              {/* CANCELED Overlay */}
              {event.status === "canceled" && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    bgcolor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
                  }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'white', 
                      fontSize:'3.5rem',
                      fontWeight: 'bold', 
                      textTransform: 'uppercase',
                      opacity: 0.7, // Reduced opacity
                    }}
                  >
                    Canceled
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)}>
          <DialogTitle sx={{ bgcolor: "black", color: "white" }}>
            {selectedEvent.name}
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "black", color: "white", p: 0 }}>
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
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "white" }}>
                Date: {selectedEvent.date}
              </Typography>
              <Typography variant="body1">{selectedEvent.description}</Typography>
              {selectedEvent.status === "canceled" && (
                <Typography variant="h5" sx={{ color: "red", fontWeight: "bold", mt: 2 }}>
                  This Event Has Been CANCELED
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ bgcolor: "black" }}>
            <Button onClick={() => setSelectedEvent(null)} sx={{ color: "white" }}>Close</Button>
            {selectedEvent.status !== "canceled" && (
              <Button 
                variant="contained" 
                color="primary" 
                href={selectedEvent.registerLink.startsWith('http') ? selectedEvent.registerLink : `https://${selectedEvent.registerLink}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Register Now
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default EventsPage;