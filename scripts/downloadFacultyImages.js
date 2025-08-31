const fs = require('fs');
const https = require('https');
const path = require('path');

const facultyImages = [
  {
    name: 'dr-pramod',
    url: 'https://pestrust.edu.in/pesitm/documents/files/faculty/1699351036_b4e4c02a133944984e26.jpg'
  },
  {
    name: 'ayisha-khanum',
    url: 'https://pestrust.edu.in/pesitm/documents/files/faculty/1699351181_b415e8fcf1793ef4eee8.jpg'
  },
  {
    name: 'manjunatha-g',
    url: 'https://pestrust.edu.in/pesitm/documents/files/faculty/1747996911_72f6a75b971050b15038.png'
  },
  {
    name: 'harish-m',
    url: 'https://pestrust.edu.in/pesitm/documents/files/faculty/1747996777_2ce61c85e87556e27f1b.jpg'
  },
  {
    name: 'kavya-s',
    url: 'https://pestrust.edu.in/pesitm/documents/files/faculty/1747997611_64eb18979c365ad723be.jpg'
  }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
      } else {
        file.close();
        fs.unlink(filepath, () => {});
        reject(`Failed to download ${url}: ${response.statusCode}`);
        return;
      }
    });

    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${url} to ${filepath}`);
      resolve();
    });

    request.on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err.message);
    });

    file.on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err.message);
    });
  });
};

const downloadAllImages = async () => {
  const imageDir = path.join(__dirname, '../public/faculty/images');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  console.log('Starting image downloads...');
  
  for (const img of facultyImages) {
    try {
      const extension = path.extname(img.url) || '.jpg';
      const filename = `${img.name}${extension}`;
      const filepath = path.join(imageDir, filename);
      
      console.log(`Downloading ${img.url}...`);
      await downloadImage(img.url, filepath);
    } catch (error) {
      console.error(`Error downloading ${img.url}:`, error);
    }
  }
  
  console.log('All downloads completed!');
};

downloadAllImages().catch(console.error);
