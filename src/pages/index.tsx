'use client';
import Head from 'next/head';
import Image from 'next/image';
import {Geist, Geist_Mono} from 'next/font/google';
import React, {useEffect, useState} from 'react';
import {
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import Prisma from '@prisma/client';
import useProducts from '@/lib/components/hooks/useProducts';
import Link from 'next/link';
import {ProductGrid} from '@/lib/components/ProductGrid';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Home() {
  const {products} = useProducts();

  return (
    <>
      <Typography
        variant="overline"
        fontSize={'2rem'}
      >
        AWE Electronics
      </Typography>
      <ProductGrid />
    </>
  );
}
