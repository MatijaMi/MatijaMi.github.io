# CR2 Decoder

A web-based decoder for Canon Raw 2 (CR2) image files, built as a Bachelor's thesis project. This application makes working with raw sensor data from Canon cameras more accessible by providing detailed metadata extraction, raw data visualization, and image decoding capabilities.

## Overview

CR2 Decoder is an interactive web application that allows users to upload Canon Raw 2 files and explore the raw sensor data along with camera metadata in real-time. The decoder implements a complete CR2 file format parser and provides multiple levels of image processing, from raw sensor output to fully processed sRGB images.

## Features

- **File Upload & Drag-and-Drop** - Easy file import with drag-and-drop support
- **Metadata Extraction** - Detailed extraction of IFD (Image File Directory) and MakerNote data
- **Multiple Decode Levels** - 6 different processing stages for image analysis:
  - **Sensor** - Raw decompressed data
  - **Normalized** - Black/white level adjusted data
  - **White-Balanced** - Color balanced output
  - **Demosaiced** - Bayer pattern interpolation
  - **sRGB** - Standard RGB color space conversion
  - **Fully Processed** - Complete image processing pipeline
- **Raw Data Visualization** - Interactive exploration of sensor data
- **Export Options** - Download decoded images as JPEG, raw data as JSON, or metadata
- **Multiple Raw Formats** - Support for RGGB (full raw), sRaw, and mRaw formats
- **Progress Tracking** - Real-time progress indication during processing

## Technical Stack

- **JavaScript** (61%) - Core decoding algorithms, UI logic, and Web Workers
- **HTML** (28.7%) - Page structure and interface markup
- **CSS** (3.6%) - Styling and responsive design
- **Java** (6.7%) - Utility tool for JSON to image conversion

## Project Structure

```
.
├── index.html              # Main application interface
├── baseStyle.css           # Base styling
├── decoderStyle.css        # Decoder-specific styles
├── Scripts/
│   ├── Decode/            # Decoding algorithms
│   │   ├── decode.js
│   │   ├── decompress.js
│   │   ├── colorConversion.js
│   │   ├── interpolations.js
│   │   └── decodeUtils.js
│   ├── MetaData/          # Metadata extraction
│   │   ├── metaData.js
│   │   ├── IFD.js
│   │   ├── MakerNote.js
│   │   ├── DHT.js
│   │   ├── SOF3.js
│   │   ├── SOS.js
│   │   └── colorData.js
│   ├── Util/              # Utility functions
│   │   ├── download.js
│   │   ├── reader.js
│   │   ├── byteTransformations.js
│   │   └── matrixFunctions.js
│   ├── UI/                # User interface logic
│   │   └── UI.js
│   └── Workers/           # Web Workers for heavy computation
├── Websites/              # Documentation pages
│   ├── cr2.html          # CR2 format introduction
│   ├── ifds.html         # IFD documentation
│   ├── rawdata.html      # Raw data information
│   ├── decoding.html     # Decoding process explanation
│   ├── tutorial.html     # Usage tutorial
│   └── About.html        # Project information
├── Data/                  # Image and color data files
├── Images/                # Logo and assets
└── Java Program/          # Auxiliary tools
    └── CR2JsonToImage.jar
```

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Canon Raw 2 (.CR2) files to decode

### Usage

1. Visit the live application at: **https://matijami.github.io**
2. Upload a CR2 file by clicking the upload area or dragging and dropping
3. View extracted metadata and raw data in the sidebar
4. Select a decode level from the "Decode Levels" panel
5. Click "Decode .CR2" to process the image
6. Download results in various formats:
   - JPEG for quick viewing
   - Raw data as JSON for further processing
   - Metadata for reference

### Decode Levels Explained

Each decode level represents a different stage of the processing pipeline:

- **Sensor**: Pure decompressed raw sensor values
- **Normalized**: Colors normalized to [0,1] range with black/white point adjustment
- **White-Balanced**: Color correction for white balance settings used during capture
- **Demosaiced**: Bayer pattern interpolation to full RGB (full RAW only)
- **sRGB**: Conversion from camera color space to standard sRGB
- **Fully Processed**: Complete processing including tone mapping and sharpening

## Advanced Features

- **Crop Borders** - Remove sensor borders from output
- **JSON Export** - Download decoded image data as 2D JSON array for custom processing
- **JPEG Export** - Quick preview export of processed images
- **Metadata Export** - Save extracted metadata for reference

## Performance

The application uses Web Workers to handle computationally intensive decoding operations without blocking the user interface, ensuring smooth interaction even during large file processing.

## About

CR2 Decoder was developed as a Bachelor's thesis project to explore Canon Raw file formats and implement a practical decoding system. The project combines comprehensive CR2 specification analysis with practical implementation, providing both educational value and a functional tool for photographers and developers working with Canon raw files.

## Documentation

The project includes detailed documentation pages:
- **CR2 Format** - Overview of the Canon Raw 2 specification
- **IFDs** - Image File Directory structures and tags
- **Raw Data** - Understanding sensor data and color formats
- **Decoding** - Technical explanation of the decoding pipeline
- **Tutorial** - Step-by-step usage guide

## License

This project is open source and available for exploration and educational purposes.

## Author

Created by MatijaMi as part of a Bachelor's thesis project.

---

**Note**: This is a client-side application. All processing happens in your browser—your image files are never uploaded to any server.