const sheetUrl1 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTzSmGTrbhPu-eKOwpLrOlvqoRIoPEN3_hnBSPnLphWUkFhvh1gGUf2Gce9NFTFJXhITGmbjDZ5YUxY/pub?gid=0&single=true&output=csv";

let currentYearFilter = "";
let currentAreaFilter = "";
let currentAlbum = [];
let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let autoPlayTimer = null;
let isAutoPlaying = false;
