/**
 * Pré-pende capa + página de marca (identidade Protocolo Bexiga Blindada™)
 * aos PDFs em public/, sem alterar o miolo.
 *
 * Uso: npm run brand:pdfs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const originalsDir = join(publicDir, "_originals");

const BRAND = rgb(15 / 255, 118 / 255, 110 / 255); // #0F766E
const BRAND_DARK = rgb(13 / 255, 92 / 255, 86 / 255);
const TINT = rgb(236 / 255, 253 / 255, 248 / 255); // #ECFDF8
const WHITE = rgb(1, 1, 1);
const INK = rgb(33 / 255, 42 / 255, 58 / 255);
const MUTED = rgb(100 / 255, 116 / 255, 139 / 255);

const A4 = { width: 595.28, height: 841.89 };

const TARGETS = [
  {
    file: "protocolo-bexiga-blindada.pdf",
    title: "Protocolo Bexiga Blindada™",
    subtitle: "Método B.A.R.R.E.I.R.A™ — prevenção organizada, passo a passo",
  },
  {
    file: "365-estrategias-21-protocolos.pdf",
    title: "365 Estratégias + 21 Protocolos Práticos",
    subtitle: "Inventário completo para abrir no celular na hora certa",
  },
  {
    file: "intimidade-sem-medo.pdf",
    title: "Intimidade Sem Medo",
    subtitle: "Antes e depois da relação, menopausa, checklist e parte emocional",
  },
  {
    file: "calendario-preventivo.pdf",
    title: "Calendário Preventivo",
    subtitle: "Planner diário marcável — leve e consumível em 1 minuto por dia",
  },
];

function resolveFontPaths() {
  const candidates = [
    ["C:/Windows/Fonts/arial.ttf", "C:/Windows/Fonts/arialbd.ttf"],
    ["/System/Library/Fonts/Supplemental/Arial.ttf", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"],
    ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"],
  ];
  for (const [regular, bold] of candidates) {
    if (existsSync(regular) && existsSync(bold)) return { regular, bold };
  }
  throw new Error(
    "Nenhuma fonte TTF encontrada. Instale Arial ou DejaVu Sans, ou ajuste resolveFontPaths().",
  );
}

function drawCover(page, fonts, item) {
  const { width, height } = A4;
  const { regular, bold } = fonts;

  page.drawRectangle({ x: 0, y: 0, width, height, color: BRAND });
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height: height * 0.28,
    color: BRAND_DARK,
  });
  page.drawRectangle({
    x: 40,
    y: height * 0.28 - 8,
    width: width - 80,
    height: 8,
    color: TINT,
  });

  page.drawText("PROTOCOLO BEXIGA BLINDADA™", {
    x: 48,
    y: height - 72,
    size: 12,
    font: bold,
    color: WHITE,
  });

  page.drawText("Material digital · Acesso vitalício", {
    x: 48,
    y: height - 92,
    size: 10,
    font: regular,
    color: rgb(0.85, 0.95, 0.93),
  });

  const titleLines = wrapText(item.title, bold, 28, width - 96);
  let titleY = height * 0.58;
  for (const line of titleLines) {
    page.drawText(line, {
      x: 48,
      y: titleY,
      size: 28,
      font: bold,
      color: WHITE,
    });
    titleY -= 34;
  }

  const subLines = wrapText(item.subtitle, regular, 12, width - 96);
  let subY = titleY - 16;
  for (const line of subLines) {
    page.drawText(line, {
      x: 48,
      y: subY,
      size: 12,
      font: regular,
      color: rgb(0.9, 0.97, 0.95),
    });
    subY -= 18;
  }

  drawBadge(page, fonts, 48, height * 0.18, "Acesso vitalício");
  drawBadge(page, fonts, 220, height * 0.18, "Conteúdo educativo");
}

function drawBadge(page, fonts, x, y, label) {
  const padX = 12;
  const textWidth = fonts.bold.widthOfTextAtSize(label, 9);
  page.drawRectangle({
    x,
    y: y - 6,
    width: textWidth + padX * 2,
    height: 24,
    color: TINT,
    borderColor: WHITE,
    borderWidth: 0,
  });
  page.drawText(label, {
    x: x + padX,
    y: y,
    size: 9,
    font: fonts.bold,
    color: BRAND_DARK,
  });
}

function drawBrandPage(page, fonts, item) {
  const { width, height } = A4;
  const { regular, bold } = fonts;

  page.drawRectangle({ x: 0, y: 0, width, height, color: TINT });
  page.drawRectangle({ x: 0, y: height - 56, width, height: 56, color: BRAND });

  page.drawText("Protocolo Bexiga Blindada™", {
    x: 48,
    y: height - 36,
    size: 14,
    font: bold,
    color: WHITE,
  });

  page.drawText("Bem-vinda ao seu material", {
    x: 48,
    y: height - 110,
    size: 22,
    font: bold,
    color: INK,
  });

  page.drawText(item.title, {
    x: 48,
    y: height - 138,
    size: 13,
    font: regular,
    color: BRAND_DARK,
  });

  const bullets = [
    "Acesso imediato e vitalício após a compra",
    "Conteúdo educativo — organize a prevenção no seu ritmo",
    "Garantia incondicional de 7 dias",
    "Não substitui avaliação, diagnóstico ou tratamento médico",
  ];

  let y = height - 190;
  for (const bullet of bullets) {
    page.drawCircle({
      x: 56,
      y: y + 4,
      size: 4,
      color: BRAND,
    });
    const lines = wrapText(bullet, regular, 12, width - 120);
    for (const line of lines) {
      page.drawText(line, {
        x: 72,
        y,
        size: 12,
        font: regular,
        color: INK,
      });
      y -= 18;
    }
    y -= 10;
  }

  y -= 20;
  page.drawRectangle({
    x: 40,
    y: y - 90,
    width: width - 80,
    height: 110,
    color: WHITE,
    borderColor: BRAND,
    borderWidth: 1,
  });

  page.drawText("Aviso importante", {
    x: 56,
    y: y - 8,
    size: 11,
    font: bold,
    color: BRAND_DARK,
  });

  const disclaimer =
    "Este material é estritamente educativo. Não realiza diagnóstico, não prescreve tratamento e não substitui a orientação de um profissional de saúde. Em sinais de alerta (febre, sangue na urina, dor lombar intensa), procure atendimento.";
  const discLines = wrapText(disclaimer, regular, 10, width - 120);
  let dy = y - 30;
  for (const line of discLines) {
    page.drawText(line, {
      x: 56,
      y: dy,
      size: 10,
      font: regular,
      color: MUTED,
    });
    dy -= 14;
  }

  page.drawText("protocolobexigablindada · conteúdo digital", {
    x: 48,
    y: 40,
    size: 9,
    font: regular,
    color: MUTED,
  });
}

function wrapText(text, font, size, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [text];
}

async function brandOne(item, fontsBytes) {
  const srcPath = join(publicDir, item.file);
  if (!existsSync(srcPath)) {
    console.warn(`Pulando (não encontrado): ${item.file}`);
    return;
  }

  mkdirSync(originalsDir, { recursive: true });
  const backupPath = join(originalsDir, item.file);
  if (!existsSync(backupPath)) {
    const probe = await PDFDocument.load(readFileSync(srcPath));
    const keywords = probe.getKeywords() ?? "";
    if (String(keywords).includes("bexiga-blindada-branded-v1")) {
      console.warn(
        `Pulando ${item.file}: já possui capa e não há backup em _originals/.`,
      );
      return;
    }
    copyFileSync(srcPath, backupPath);
    console.log(`Backup: _originals/${item.file}`);
  }

  // Sempre brand a partir do original (evita capas duplicadas em re-runs)
  const sourceBytes = readFileSync(backupPath);
  const sourcePdf = await PDFDocument.load(sourceBytes);

  const out = await PDFDocument.create();
  out.registerFontkit(fontkit);
  out.setTitle(item.title);
  out.setAuthor("Protocolo Bexiga Blindada");
  out.setSubject("Protocolo Bexiga Blindada — material digital");
  out.setKeywords(["bexiga-blindada-branded-v1", item.file]);
  out.setProducer("brand-pdfs.mjs");
  out.setCreator("Protocolo Bexiga Blindada");

  const regular = await out.embedFont(fontsBytes.regular);
  const bold = await out.embedFont(fontsBytes.bold);
  const fonts = { regular, bold };

  const cover = out.addPage([A4.width, A4.height]);
  drawCover(cover, fonts, item);

  const brand = out.addPage([A4.width, A4.height]);
  drawBrandPage(brand, fonts, item);

  const copied = await out.copyPages(sourcePdf, sourcePdf.getPageIndices());
  for (const p of copied) out.addPage(p);

  const bytes = await out.save();
  writeFileSync(srcPath, bytes);
  console.log(`OK: ${item.file} (+2 páginas de marca)`);
}

async function main() {
  const paths = resolveFontPaths();
  const fontsBytes = {
    regular: readFileSync(paths.regular),
    bold: readFileSync(paths.bold),
  };

  for (const item of TARGETS) {
    await brandOne(item, fontsBytes);
  }
  console.log("Concluído.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
