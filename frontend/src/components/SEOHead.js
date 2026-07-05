import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const SEOHead = ({ title, description, keywords, image = 'https://casinotkm.com/og-image.png', url = 'https://casinotkm.com' }) => {
  return (
    <Helmet>
      <title>{title} | CasinoTKM</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEOHead;
