const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname,'..');
const downloads = 'C:/Users/Jaspreet Singh/Downloads';
async function main() {
  const target = path.join(root,'public/brand'); fs.mkdirSync(target,{recursive:true});
  const images = [['jasvir logo .png','logo-original.png'],['jasvir backdetail.png','contact-artwork.png'],['jasvir  LinkedIn Banner.png','linkedin-banner.png']];
  for(const [source,dest] of images) fs.copyFileSync(path.join(downloads,source),path.join(target,dest));
  await sharp(path.join(downloads,'jasvir logo .png')).extract({left:239,top:660,width:545,height:553}).resize(256,256).webp({quality:90}).toFile(path.join(target,'js-monogram.webp'));
  await sharp(path.join(downloads,'jasvir  LinkedIn Banner.png')).resize({width:1584,withoutEnlargement:true}).webp({quality:90}).toFile(path.join(target,'linkedin-banner.webp'));
  fs.writeFileSync(path.join(target,'jasvir-singh.vcf'), 'BEGIN:VCARD\r\nVERSION:3.0\r\nN:Singh;Jasvir;;;\r\nFN:Jasvir Singh\r\nTITLE:Video Editor and Graphics Designer\r\nTEL;TYPE=CELL:+919517717717\r\nEMAIL:jasvir.visual06@gmail.com\r\nADR;TYPE=WORK:;;;Bathinda;Punjab;;India\r\nEND:VCARD\r\n');
  fs.mkdirSync(path.join(root,'content'),{recursive:true});
  fs.copyFileSync(path.join(downloads,'project-brief-jasveer-editor.txt'),path.join(root,'content/project-brief-reference.txt'));
  console.log('Imported all three branding images and supplied brief; prepared logo and contact card.');
}
main().catch(e=>{console.error(e);process.exit(1)});
