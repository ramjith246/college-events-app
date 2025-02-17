"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Box, Typography, Grid, Button, Container, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, Drawer, List, ListItemButton, ListItemText, IconButton, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface Event {
  id: string;
  name?: string;
  imageUrl?: string;
  description?: string;
  registerLink?: string;
  status?: 'canceled' | 'postponed';
  date?: string;
}

const fetchCollectionData = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
  } catch (error) {
    console.error(`Error fetching ${collectionName} data:`, error);
    return [];
  }
};

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchCollectionData('events').then(setEvents); }, []);

  const handlePageChange = async (page: 'events' | 'workshops' | 'internships') => {
    const collectionName = page === 'workshops' ? 'external_workshop' : page === 'internships' ? 'external_internship' : 'events';
    const data = await fetchCollectionData(collectionName);
    setEvents(data);
    setDrawerOpen(false);
  };

  const filteredEvents = events.filter(event =>
    (event.name && event.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Container>
      <IconButton onClick={() => setDrawerOpen(true)} sx={{ position: 'absolute', top: 16, left: 16 }}>
        <MenuIcon sx={{ color: 'white' }} />
      </IconButton>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          <ListItemButton onClick={() => handlePageChange('events')}><ListItemText primary="Events" /></ListItemButton>
          <ListItemButton onClick={() => handlePageChange('workshops')}><ListItemText primary="External Workshops" /></ListItemButton>
          <ListItemButton onClick={() => handlePageChange('internships')}><ListItemText primary="External Internships" /></ListItemButton>
        </List>
      </Drawer>
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h4" gutterBottom>College Events</Typography>
      </Box>
      <TextField
        fullWidth
        placeholder="Search events..."
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Grid container spacing={3}>
        {filteredEvents.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event.id} sx={{ position: 'relative' }}>
            <Card onClick={() => setSelectedEvent(event)} sx={{ cursor: 'pointer', height: 350, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {event.status && (
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                  <Typography variant="h6" sx={{ color: 'white', backgroundColor: 'red', px: 2, py: 1 }}>{event.status.toUpperCase()}</Typography>
                </Box>
              )}
              <CardMedia component="img" height="200" image={event.imageUrl} alt={event.name} sx={{ objectFit: "cover" }} />
              <CardContent sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h6" align="center">{event.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedEvent && (
        <Dialog open={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)}>
          <DialogTitle>{selectedEvent.name}</DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img src={selectedEvent.imageUrl} alt={selectedEvent.name} style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} />
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1">{selectedEvent.description}</Typography>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Event Date: {selectedEvent.date}</Typography>
              {selectedEvent.status && (
                <Typography variant="h6" sx={{ color: 'red', mt: 2 }}>{selectedEvent.status.toUpperCase()}</Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedEvent(null)}>Close</Button>
            <Button variant="contained" color="primary" href={selectedEvent.registerLink} target="_blank" rel="noopener noreferrer">Register Now</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default EventsPage;
