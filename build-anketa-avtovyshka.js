const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = require('docx');
const fs = require('fs');

const COLOR_ACCENT = 'C85A1A';
const COLOR_MUTED = '666666';
const COLOR_DARK = '1F1F1F';

const H1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 480, after: 180 },
  children: [new TextRun({ text, bold: true, size: 32, color: COLOR_DARK })],
});

const H2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 320, after: 120 },
  children: [new TextRun({ text, bold: true, size: 26, color: COLOR_ACCENT })],
});

const P = (text, opts = {}) => new Paragraph({
  spacing: { after: 100 },
  children: [new TextRun({ text, size: 22, ...opts })],
});

const Note = (text) => new Paragraph({
  spacing: { after: 160 },
  children: [new TextRun({ text, size: 20, italics: true, color: COLOR_MUTED })],
});

const Q = (text) => [
  new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text, size: 22, bold: true })],
  }),
  new Paragraph({
    spacing: { after: 120 },
    border: { bottom: { color: '999999', space: 2, style: BorderStyle.SINGLE, size: 6 } },
    children: [new TextRun({ text: '', size: 22 })],
  }),
  new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: '', size: 22 })] }),
];

const QMulti = (text, lines = 4) => {
  const out = [new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text, size: 22, bold: true })],
  })];
  for (let i = 0; i < lines; i++) {
    out.push(new Paragraph({
      spacing: { after: 60 },
      border: { bottom: { color: '999999', space: 2, style: BorderStyle.SINGLE, size: 6 } },
      children: [new TextRun({ text: '', size: 22 })],
    }));
  }
  out.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '', size: 22 })] }));
  return out;
};

const Opt = (text) => new Paragraph({
  spacing: { after: 60 },
  indent: { left: 360 },
  children: [new TextRun({ text: '☐  ' + text, size: 22 })],
});

const Divider = () => new Paragraph({
  spacing: { before: 240, after: 240 },
  border: { bottom: { color: 'CCCCCC', space: 4, style: BorderStyle.SINGLE, size: 6 } },
  children: [new TextRun({ text: '' })],
});

const children = [];

// Cover
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 240 },
  children: [new TextRun({ text: 'ДОПОЛНЕНИЕ К АНКЕТЕ', bold: true, size: 24, color: COLOR_ACCENT })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 120 },
  children: [new TextRun({ text: 'Аренда автовышки', bold: true, size: 44, color: COLOR_DARK })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 400 },
  children: [new TextRun({ text: 'отдельная услуга на сайте — нужны данные по машине и условиям', size: 22, color: COLOR_MUTED, italics: true })],
}));

children.push(Note('Разведка показала, что «аренда автовышки» — одна из самых востребованных услуг по области (649 запросов/мес, сопоставимо со спилом). Поэтому делаем ей отдельную страницу на сайте. Для неё нужны конкретные данные по машине и условиям — ниже короткий блок вопросов.'));

children.push(Divider());

// 1. ТТХ машины
children.push(H1('1. Техника — что за автовышка'));

children.push(...Q('1.1. Марка и модель автовышки (например: ГАЗ-3309 с АГП-18, ЗИЛ-130 с ВС-22, самоходная ножничная JLG, и т.п.)'));
children.push(...Q('1.2. Высота подъёма стрелы (максимальная рабочая высота, в метрах)'));
children.push(...Q('1.3. Вылет стрелы (на какое расстояние вбок от машины дотягивается, в метрах)'));
children.push(...Q('1.4. Грузоподъёмность люльки (кг — сколько кг / сколько человек влезает)'));

children.push(P('1.5. Тип шасси:', { bold: true }));
children.push(Opt('На базе грузовика (ГАЗ, ЗИЛ, КАМАЗ) — обычная автовышка'));
children.push(Opt('Самоходная (ножничный / коленчатый подъёмник)'));
children.push(Opt('Прицепная'));
children.push(Opt('Другое: ___________________________'));

children.push(...Q('1.6. Габариты для проезда (ширина, высота в сложенном виде — чтобы клиенты понимали, пройдёт ли в их двор/ворота)'));

children.push(...Q('1.7. Нужен ли люльке электричество / особые условия работы? (например «220В на люльке есть/нет», «работает при морозе до −30°C»)'));

children.push(Divider());

// 2. Условия аренды
children.push(H1('2. Условия аренды — цена, смена, выезд'));

children.push(...Q('2.1. Минимальная смена (сколько часов берётся как минимум, даже если задача на 20 минут)'));

children.push(...Q('2.2. Ставка за 1 час работы в Серове (руб)'));

children.push(...Q('2.3. Ставка за смену (обычно 8 часов) (руб)'));

children.push(...Q('2.4. Что входит в стоимость часа/смены? (работа оператора, топливо, выезд по городу, страховка)'));

children.push(...Q('2.5. Выезд за город — как считается? (например «до 20 км — бесплатно», «дальше — 50 руб/км в обе стороны»)'));

children.push(P('2.6. С оператором или без?', { bold: true }));
children.push(Opt('Только с оператором (безопаснее, не нужны допуски у клиента)'));
children.push(Opt('Можно без оператора (если у клиента есть допуски)'));
children.push(Opt('Договариваемся отдельно'));

children.push(...Q('2.7. Работа в вечернее время / выходные — есть доплата? Какая?'));

children.push(...Q('2.8. Минимальный заказ по времени для выезда в окрестные города (Краснотурьинск, Карпинск и т.д.) — например «от 4 часов» или «только посуточно»'));

children.push(Divider());

// 3. Для каких задач берут
children.push(H1('3. Для каких задач клиенты берут вышку (отметить всё, что бывает)'));
children.push(Note('Это нужно, чтобы на сайте написать «для чего можно арендовать» и ловить клиентов разных ниш.'));

children.push(Opt('Спил / обрезка деревьев'));
children.push(Opt('Монтаж / демонтаж вывесок, баннеров, рекламы'));
children.push(Opt('Кровельные работы, ремонт крыши'));
children.push(Opt('Монтаж и обслуживание освещения (фонари, уличные светильники)'));
children.push(Opt('Электромонтаж на высоте'));
children.push(Opt('Покраска, обслуживание фасадов'));
children.push(Opt('Чистка водостоков'));
children.push(Opt('Съёмка с высоты (фото/видео)'));
children.push(Opt('Работы на территории заводов / предприятий'));
children.push(Opt('Монтаж антенн, кондиционеров'));
children.push(Opt('Другое: ___________________________'));

children.push(Divider());

// 4. Документы и допуски
children.push(H1('4. Документы и ответственность'));

children.push(...Q('4.1. Есть ли удостоверение оператора автовышки / корочки машиниста?'));
children.push(...Q('4.2. Страхование ответственности оператора/техники — есть? Какое?'));
children.push(...Q('4.3. Работаете по договору с юрлицами (безнал, акты, счета-фактуры)? Да/нет'));

children.push(Divider());

// 5. Фото
children.push(H1('5. Фото автовышки — критично ⭐'));
children.push(Note('На сайте люди хотят видеть именно машину, которую арендуют. Если фото нет — попросить папу сфоткать в ближайший рабочий день.'));

children.push(P('Нужно прислать (приложить к письму, в WhatsApp, в Telegram):', { bold: true }));
children.push(Opt('⭐ Автовышка целиком — сбоку, при дневном свете, чистая'));
children.push(Opt('⭐ Автовышка в работе — стрела поднята, человек в люльке (на фоне здания/дерева)'));
children.push(Opt('Люлька крупным планом'));
children.push(Opt('Пульт управления (внутри люльки, если есть)'));
children.push(Opt('Автовышка в стеснённых условиях — во дворе, между зданиями (сильно продаёт)'));
children.push(Opt('Автовышка на фоне завода / промышленного объекта (для B2B-блока)'));

children.push(Divider());

// 6. Отличия / особенности
children.push(H1('6. Чем ваша автовышка лучше конкурентов?'));
children.push(Note('Если нечего отметить — пропустить. Любая мелочь, которая выгодно отличает: «новая», «с собственным оператором с 10-летним стажем», «проходит в ворота 2,5 м», «работает при −30°C» и т.п.'));

children.push(...QMulti('Напишите свободно 2–3 отличия:', 4));

children.push(Divider());

// 7. Свободное поле
children.push(H1('7. Свободное поле'));
children.push(Note('Всё, что хотите упомянуть про автовышку, но что не влезло в вопросы выше.'));

children.push(...QMulti('', 6));

// === build ===
const doc = new Document({
  creator: 'Тима',
  title: 'Анкета — автовышка',
  description: 'Дополнение к основной анкете: данные по автовышке для отдельной страницы сайта',
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 22 } },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const out = 'Анкета-автовышка.docx';
  fs.writeFileSync(out, buf);
  console.log('✓ Файл создан:', out, '(', buf.length, 'bytes )');
});
