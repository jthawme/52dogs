import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { dogs } from './data';

const ImageLoader = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = err => reject(err);
      img.src = src;
    })
  };

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const WIDTH = 1600;
const HEIGHT = WIDTH;

canvas.width = WIDTH;
canvas.height = HEIGHT;
canvas.style.width = `${WIDTH / 2}px`;
canvas.style.height = `${HEIGHT / 2}px`;

function getImage(idx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    return new Promise((resolve, reject) => {
        ImageLoader(dogs[idx].img)
            .then(imgEl => {
                const xOffset = (WIDTH - imgEl.width) / 2;
                const yOffset = (HEIGHT - imgEl.height) / 2;

                ctx.drawImage(imgEl, xOffset, yOffset, imgEl.width, imgEl.height);

                ctx.font = '300 32px monospace';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.fillText(dogs[idx].label, WIDTH / 2, HEIGHT - (yOffset * 0.8));

                canvas.toBlob(blob => resolve(blob), 'image/jpeg', 1);
            });
    });
}

const blobs = [];

function runImage(idx) {
    getImage(idx)
        .then(blob => {
            blobs.push(blob);

            if (idx + 1 < dogs.length) {
                runImage(idx + 1);
            } else {
                const zip = new JSZip();
                
                blobs.forEach((b, index) => {
                    zip.file(`${String(index).padStart(3, '0')}.jpg`, b);
                });

                zip.generateAsync({ type: 'blob' })
                    .then(content => {
                        saveAs(content, "example.zip");
                    });
            }
        });
}
runImage(0);
