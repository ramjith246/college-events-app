'use client';

import React, { useEffect, useState } from 'react';
import { db1, db2 } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Box, Typography, Grid, Button, Container, Card, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import Image from "next/image";
import Head from 'next/head';
import MenuIcon from '@mui/icons-material/Menu'; // Import the hamburger menu icon

interface Fest {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  registerLink: string;
  date: string;
  status?: string;
}

const FestsPage = () => {
  const [fests, setFests] = useState<Fest[]>([]);
  const [selectedFest, setSelectedFest] = useState<Fest | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // State to manage drawer open/close

  useEffect(() => {
    const fetchFests = async () => {
      try {
        const [snapshot1, snapshot2] = await Promise.all([
          getDocs(collection(db1, 'fests')), // Fetch from first database
          getDocs(collection(db2, 'fests')) // Fetch from second database
        ]);

        const fests1 = snapshot1.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          description: doc.data().description || "No description available",
          registerLink: doc.data().registerLink || "#",
          date: doc.data().date || "Date not available",
          status: doc.data().status || "active"
        }));

        const fests2 = snapshot2.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          description: doc.data().description || doc.data().desc || "No description available",
          registerLink: doc.data().registerLink || "#",
          date: doc.data().date || "Date not available",
          status: doc.data().status || "active"
        }));

        setFests([...fests1, ...fests2]);
      } catch (error) {
        console.error('Error fetching fests:', error);
      }
    };

    fetchFests();
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
            <ListItem button component="a" href="/">
              <ListItemText primary="Events" />
            </ListItem>
            <ListItem button component="a" href="/internships">
              <ListItemText primary="Internships" />
            </ListItem>
            <ListItem button component="a" href="/FestsPage">
              <ListItemText primary="Fests" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ fontFamily: '"Old Standard TT", serif' }}
        >
          Fests GEC
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {fests.map(fest => (
          <Grid item xs={12} sm={6} md={4} key={fest.id}>
            <Card 
              onClick={() => setSelectedFest(fest)} 
              sx={{ 
                cursor: 'pointer', 
                height: 350, 
                display: 'flex', 
                flexDirection: 'column',
                filter: fest.status === "canceled" ? "grayscale(100%)" : "none", 
                opacity: fest.status === "canceled" ? 0.6 : 1,
                position: 'relative' // Needed for overlay
              }}
            >
              <CardMedia 
                component="img" 
                height="200"
                image={fest.imageUrl} 
                alt={fest.name} 
                sx={{ objectFit: "cover" }}
              />

              {/* CANCELED Overlay */}
              {fest.status === "canceled" && (
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

      {/* Fest Details Dialog */}
      {selectedFest && (
        <Dialog open={Boolean(selectedFest)} onClose={() => setSelectedFest(null)}>
          <DialogTitle sx={{ bgcolor: "black", color: "white" }}>
            {selectedFest.name}
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "black", color: "white", p: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Image 
                src={selectedFest.imageUrl} 
                alt={selectedFest.name} 
                width={800}
                height={600}
                unoptimized
                style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "0" }}
              />
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "white" }}>
                Date: {selectedFest.date}
              </Typography>
              <Typography variant="body1">{selectedFest.description}</Typography>
              {selectedFest.status === "canceled" && (
                <Typography variant="h5" sx={{ color: "red", fontWeight: "bold", mt: 2 }}>
                  This Fest Has Been CANCELED
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ bgcolor: "black" }}>
            <Button onClick={() => setSelectedFest(null)} sx={{ color: "white" }}>Close</Button>
            {selectedFest.status !== "canceled" && (
              <Button 
                variant="contained" 
                color="primary" 
                href={selectedFest.registerLink.startsWith('http') ? selectedFest.registerLink : `https://${selectedFest.registerLink}`} 
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

export default FestsPage;