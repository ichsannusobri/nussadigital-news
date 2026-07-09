const fs = require('fs');
const path = require('path');

const authorsDir = path.join(__dirname, '..', 'public', 'authors');

// Create the public/authors directory if it doesn't exist
if (!fs.existsSync(authorsDir)) {
  fs.mkdirSync(authorsDir, { recursive: true });
}

// 1x1 pixel grey transparent PNG placeholder base64
const greyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// A slightly more complex generic user avatar PNG base64 (approx 100x100 circle with user silhouette)
// Since we want it to look professional out-of-the-box before they upload their photos, 
// let's write a small base64 string of a clean avatar.
const genericUserAvatarBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AcJBRMVO9w3nAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLm4clwAABAdJREFUeNrt299rVWEcx/H355ztsd3NdHN/oF24FGl/oFAjEUbRlTfZRReBEXQRhF0E3XQTRdBdN10EhhFEF10UkV34B0HZRRBFEDVd2M055+zpi61N25yee87OPGfn+/W8P+B1sDkfn/O5v9/v54DneZ7neZ7neZ7neZ7neZ7neV7g5V6E69xUa7UGlpaWGtq5pG3/YpA4jktYV6P/j2F7e/v44eHhcK+Vee4ZpU20h0dE2iL6iEivkL4nvUd6k/QaaZtIk0if/N4a0nOkx0mPkB4m3U+6l3Qv6S7SXaRbSbeQtr970xU2a63W/Cq7ZlqfNqTN40Zae6N9l/Rp0sdJH5B+JD1Geoz0MOl+0r2ke0l3ke4i3Uq6hbS95Q1gR3t7+2p1dTXQ19en9fX1QLu6uhqWlpbWvB8i0m1EurnFvR8iaQeRbiPdxpYuLi6ufT8iIu3S2n5ERNpF2v4/10REpFs0bktLS2s+GCIi0i0at/X19XXvh4h0G2kXbWdpaWnNB0NExL0fERFpF43bh9XVVW9t3qpxe1tYWPAODg6GR0dHt31EREQ6bse35d+9h1hR2kR7+Pf/93rWlh8W6UXSs6TvkT4iPUf6nPQd6VPSA6THSQ+THibdT7qXdC/pLtJdpFtJt5C2v/u9W0O2aK1Wf5VdM61PG9LmcSOtvdG+S/o06eOkD0g/kh4jPUZ6mHQ/6V7SvaS7SHeRbiLdwvv5bM6LchH6EBEREREZGBjYlZeK9D7pR6SPSZ+SPiN9TvqB9FHpU9NnpT9J/5b+M31++sL05ekr0lenr09fX/y6N8PifETaJNoi+ojIr5C+J71Hekt0m+iO0d2kO0d3k+4h3SP6uOgTokeJPmH6VOkzpo+fPkH6hOmT1hfp09YX69PXD/8bL8pl6ENEulXj51f0qemz0p+kf0v/mT4/fWH68vQVfWr6rPQn6d/Sf6bP6NOmT5U+Y/r46ROkT5g+aX2RPm19sT59/fDrXpbL0IeIdKvGz6/oU9NnpT9J/5b+M31++sL05ekr+tT0WelP0r+l/0yf0adNnyp9xvTx0ydInzB90voifdr6Yn36+uHXtSwXoQ8R6VaNn1/Rp6bPsn+V9VnpV9b3sj4r/bqs72p9ZvpFWevLsi7LWp+VPit9VvpM9pnss9hnsK/Hvh77euTrcfltLksfItKtGj+/ok9Nn5X+JP1b+s/0+ekL05enr+hT02elP0n/lv4zfUafNn2q9BnTx0+fIH3C9Enri/Rp64v16euHX9ey/A/0ISLdqoZ/tT7N/knW59n3sj7Pvp/1BfWDWD/L+sL6YdbPsr6wfpj1hfXDWD/E+iGsfwf7evw2y+V/oA8R6VY1fPz46W/Z/8r6p6z/zvqnrv+B+k9ZP8/6QdanrJ9n/SDr51k/yPpB1g9h/RDWD/z7XGv/AyfL+d+c53me53me53me53me53me53me53mBF/4Hw8G7vLq6WrcAAAAASUVORK5CYII=';

// Write placeholder files
fs.writeFileSync(path.join(authorsDir, 'ichsan-n.png'), Buffer.from(genericUserAvatarBase64, 'base64'));
fs.writeFileSync(path.join(authorsDir, 'filza-syah.png'), Buffer.from(genericUserAvatarBase64, 'base64'));
fs.writeFileSync(path.join(authorsDir, 'editorial-team.png'), Buffer.from(greyPngBase64, 'base64'));
fs.writeFileSync(path.join(authorsDir, 'sport-team.png'), Buffer.from(greyPngBase64, 'base64'));

console.log('Placeholder author profile images written successfully to public/authors/.');
