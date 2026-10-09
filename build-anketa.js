const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, LevelFormat } = require('docx');
const fs = require('fs');

const COLOR_ACCENT = 'C85A1A';
const COLOR_MUTED = '666666';
const COLOR_DARK = '1F1F1F';

// === helpers ===
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

// Question + an underlined blank line for the answer
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

// Multiline answer area (N blank underlined lines)
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

// Checkbox-style option line
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

// === content ===
const children = [];

// Cover
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 400, after: 100 },
  children: [new TextRun({ text: 'АНКЕТА ДЛЯ САЙТА', bold: true, size: 44, color: COLOR_DARK })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 100 },
  children: [new TextRun({ text: 'Промышленный альпинизм · спил деревьев', size: 26, color: COLOR_ACCENT })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 400 },
  children: [new TextRun({ text: 'г. Серов · Свердловская обл.', size: 22, color: COLOR_MUTED, italics: true })],
}));

children.push(new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({
    text: 'Привет! Заполните, пожалуйста, эту анкету — на её основе я соберу сайт. Отвечайте в свободной форме, своими словами, прямо под каждым вопросом. Если на какой-то вопрос ответа пока нет — пропускайте, вернёмся позже.',
    size: 22,
  })],
}));
children.push(Note('Заполнять можно прямо в Word (кликнуть по линии и писать) или от руки — распечатать и потом сфоткать.'));

children.push(Divider());

// ========== БЛОК 1: КТО ВЫ ==========
children.push(H1('1. Кто вы и как к вам обращаться'));

children.push(...Q('ФИО (как в документах ИП):'));
children.push(...Q('Как называем на сайте — просто по имени-отчеству, или есть название/бренд ИП?'));
children.push(Note('Пример: «ИП Иванов И. И.», или «ВысотаСервис», или просто «Александр Петрович — промышленный альпинист».'));

children.push(...Q('Сколько лет уже этим занимаетесь (стаж в промальпе)?'));

children.push(...QMulti('Коротко про себя — что хотите, чтобы прочитал о вас клиент на странице «О компании». 3-5 предложений: откуда начинал, что умеет, чем гордится.', 6));

// ========== БЛОК 2: КОНТАКТЫ ==========
children.push(H1('2. Контакты'));

children.push(...Q('Телефон для сайта (основной, по которому звонить клиентам):'));
children.push(...Q('WhatsApp — тот же номер или другой?'));
children.push(...Q('Telegram — есть? Укажите @username или номер.'));
children.push(...Q('Email для сайта (на который могут писать клиенты и юрлица):'));
children.push(...Q('График работы (во сколько можно звонить):'));
children.push(Note('Пример: «ежедневно 8:00–21:00», или «пн-сб 9:00–20:00, вс выходной», или «круглосуточно по аварийным вызовам».'));

children.push(...QMulti('Реквизиты ИП (ИНН, ОГРНИП, расчётный счёт, банк) — для блока «юридическим лицам». Можно прислать отдельным файлом.', 4));

// ========== БЛОК 3: ГЕОГРАФИЯ ==========
children.push(H1('3. География работы'));

children.push(P('Основной город — Серов. Нужно уточнить, в какие ещё города реально выезжаете. Это важно для продвижения в поиске.', { bold: true }));

children.push(P('Отметьте галочкой города, в которые реально выезжаете (или вычеркните, если не берёте):'));
children.push(Opt('Краснотурьинск  (~45 км)'));
children.push(Opt('Карпинск  (~65 км)'));
children.push(Opt('Североуральск  (~90 км)'));
children.push(Opt('Волчанск  (~70 км)'));
children.push(Opt('Сосьва  (~45 км)'));
children.push(Opt('Новая Ляля  (~75 км)'));
children.push(Opt('Верхотурье  (~100 км)'));
children.push(Opt('Нижняя Тура  (~90 км)'));
children.push(Opt('Качканар  (~110 км)'));
children.push(Opt('Лесной  (~100 км)'));

children.push(...QMulti('Какие ещё посёлки / города / районы — впишите:', 3));

children.push(...Q('Есть ли ограничения по выезду (минимальная сумма заказа при выезде за город, доплата за километраж и т. п.)?'));

// ========== БЛОК 4: УСЛУГИ ==========
children.push(H1('4. Услуги — что реально делаете'));

children.push(P('На сайте флагманское направление — спил и удаление деревьев. Остальные услуги — отдельными страницами. Проверьте список и подтвердите / поправьте.', { bold: true }));

children.push(H2('4.1. Спил и удаление деревьев (главное)'));
children.push(P('Отметьте, что из этого делаете:'));
children.push(Opt('Удаление аварийных деревьев (угрожающих домам, проводам)'));
children.push(Opt('Спил по частям в стеснённых условиях (рядом с постройками)'));
children.push(Opt('Валка целиком (где есть пространство)'));
children.push(Opt('Кронирование / обрезка / формовка кроны'));
children.push(Opt('Корчевание пней вручную'));
children.push(Opt('Раскряжёвка, распил на дрова'));
children.push(Opt('Вывоз порубочных остатков, уборка территории'));
children.push(Opt('Помощь с оформлением порубочного билета'));

children.push(...QMulti('Что ещё по деревьям делаете, чего нет в списке:', 3));

children.push(H2('4.1.1. ⭐ Удаление пней САМОХОДНОЙ ФРЕЗОЙ'));
children.push(P('Это важная услуга — на сайте будет выделена отдельным крупным блоком с акцентом «удалим пень без разрытого участка». Чтобы правильно её подать — нужны детали.', { bold: true }));

children.push(...Q('Марка / модель фрезы (чтобы на сайте можно было упомянуть «профессиональная фреза такой-то марки»):'));
children.push(...Q('Какой МАКСИМАЛЬНЫЙ диаметр пня берёт (в см)?'));
children.push(...Q('На какую ГЛУБИНУ фрезерует (сколько см ниже уровня земли)?'));
children.push(...Q('Проходит ли в стандартные ворота/калитку? Какая ширина фрезы?'));
children.push(...Q('Может ли работать на газоне / клумбе без разрушения вокруг?'));

children.push(...QMulti('Сколько времени занимает удаление одного пня среднего размера (например 30-40 см диаметром)?', 2));

children.push(...Q('Что остаётся после работы — щепа? Входит ли уборка в стоимость?'));

children.push(...Q('Берёте ли отдельно заказ только на удаление пней (без спила деревьев)?'));
children.push(Note('Это важно — многие клиенты уже сами спилили дерево, остался пень. Если берёте отдельно — это огромный пласт заказов.'));

children.push(H2('4.2. Другие услуги'));
children.push(P('Отметьте все направления, которыми занимаетесь:'));
children.push(Opt('Монтаж снегоудержателей на крыши'));
children.push(Opt('Очистка крыш от снега и наледи'));
children.push(Opt('Сбивание сосулек'));
children.push(Opt('Высотные / фасадные работы (мойка, покраска, герметизация)'));
children.push(Opt('Сварочные работы на высоте'));
children.push(Opt('Монтаж / демонтаж на высоте (баннеры, вывески, антенны)'));
children.push(Opt('Герметизация межпанельных швов'));
children.push(Opt('Другое (вписать ниже)'));

children.push(...QMulti('Что ещё:', 3));

// ========== БЛОК 5: ЦЕНЫ ==========
children.push(H1('5. Цены — хотя бы ориентиры'));

children.push(P('На сайте будет блок «от чего зависит цена» — не обязательно давать точные цены, но нужны вилки, чтобы клиент понимал порядок сумм. Иначе он просто уйдёт к конкурентам, где цены указаны.'));

children.push(...QMulti('Спил среднего дерева (например, берёза во дворе частного дома) — какая вилка цены? От чего зависит?', 4));

children.push(...QMulti('Спил аварийного дерева в стеснённых условиях (вплотную к дому) — какая вилка?', 4));

children.push(...QMulti('Удаление пня ФРЕЗОЙ — цена: как считаете (за см диаметра / за пень / фикс)? Вилки по размерам пней?', 4));

children.push(...Q('Есть ли минимальная сумма выезда ТОЛЬКО с фрезой (чтобы ехать не ради одного маленького пня)?'));

children.push(...QMulti('Вывоз остатков — отдельно считается или входит в стоимость?', 3));

children.push(...QMulti('Очистка крыши от снега — как считаете (за м², за объект)?', 3));

children.push(...Q('Берёте ли предоплату? Какой процент?'));

children.push(...Q('Для юрлиц: минимальная сумма заказа есть? Какая?'));

// ========== БЛОК 6: ТЕХНИКА И БРИГАДА ==========
children.push(H1('6. Техника и команда'));

children.push(...QMulti('Какая техника есть в собственности (автовышка — марка/высота стрелы, бензопилы, снаряжение, другое)?', 5));

children.push(...Q('Размер бригады (сколько человек работают постоянно)?'));

children.push(...Q('Привлекаете ли подрядчиков на крупные объекты? Это важно упомянуть при тендерах.'));

// ========== БЛОК 7: ДОКУМЕНТЫ И ДОПУСКИ ==========
children.push(H1('7. Документы и допуски'));

children.push(P('На сайте будет блок «доверие». Отметьте, что из этого у вас есть — сканы / фото приложить к анкете отдельно.'));

children.push(Opt('Свидетельство о регистрации ИП'));
children.push(Opt('Удостоверение промышленного альпиниста (с указанием разряда)'));
children.push(Opt('Разряды бригады (других работников)'));
children.push(Opt('Допуск СРО (если есть)'));
children.push(Opt('Аттестация НАКС по сварке'));
children.push(Opt('Страхование гражданской ответственности'));
children.push(Opt('Удостоверения по работам на высоте'));
children.push(Opt('Удостоверение по электробезопасности'));
children.push(Opt('Другие корочки / сертификаты'));

children.push(...QMulti('Какие ещё документы — впишите:', 3));

children.push(Note('ВАЖНО: сканы/фото всех отмеченных документов приложите к анкете (можно сфоткать на телефон). Они пойдут в блок «документы» на сайте — это сильно поднимает доверие.'));

// ========== БЛОК 8: ОПЫТ И ОБЪЕКТЫ ==========
children.push(H1('8. Опыт и объекты'));

children.push(...Q('Примерное количество объектов за всё время работы (хотя бы грубо: 100? 500? 1000+?):'));

children.push(...QMulti('Самые крупные / значимые объекты, которыми можно гордиться (назовите 3-5 — какие объекты, что делали, когда). Если участвовали в госзакупках/тендерах — назовите.', 8));

children.push(...QMulti('Постоянные клиенты (УК, ТСЖ, предприятия) — кто с вами работает регулярно? Можно без имён, просто сферы: «3 управляющие компании», «цех завода» и т. д.', 5));

// ========== БЛОК 9: ФОТО ==========
children.push(H1('9. Фото работ — главное'));

children.push(P('Это самое важное. Без реальных фото сайт не продаёт. Нужно столько, сколько есть — чем больше, тем лучше.', { bold: true }));

children.push(P('Что нужно (хотя бы по 2-3 фото каждой категории):'));
children.push(Opt('Процесс спила дерева (альпинист на дереве, бензопила в работе)'));
children.push(Opt('Автовышка в работе'));
children.push(Opt('Удаление аварийного дерева рядом с постройкой'));
children.push(Opt('⭐ Фреза в работе (как превращает пень в щепу) — КРИТИЧНО, это ваш козырь'));
children.push(Opt('⭐ До/после удаления пня (был пень → ровный участок) — минимум 3-5 кадров'));
children.push(Opt('Корчевание пней вручную'));
children.push(Opt('До/после — одно и то же место, фото «было дерево / не стало дерева»'));
children.push(Opt('Работа на крыше (снегоудержатели, очистка от снега)'));
children.push(Opt('Высотные / фасадные работы'));
children.push(Opt('Сварка на высоте'));
children.push(Opt('Техника и снаряжение (красивые фото оборудования)'));
children.push(Opt('Бригада в работе / групповое фото'));
children.push(Opt('Портрет (для блока «О компании»)'));

children.push(Note('Складывайте всё в одну папку и присылайте Тиме — я разберу и обработаю. Качество телефона — ок, лишь бы не было размытия и было светло. Если старых фото мало — на ближайших 2-3 объектах специально поснимайте.'));

// ========== БЛОК 10: ОТЗЫВЫ ==========
children.push(H1('10. Отзывы клиентов'));

children.push(P('Нужно 3-5 отзывов. Варианты, откуда взять:'));
children.push(Opt('Попросить постоянных клиентов написать пару предложений'));
children.push(Opt('Скриншоты переписок с благодарностями (с согласия)'));
children.push(Opt('Отзывы из 2ГИС, Яндекс.Карт, Авито — если есть'));

children.push(...QMulti('Впишите имеющиеся отзывы (или кто может их дать — потом соберём):', 6));

// ========== БЛОК 11: КОНКУРЕНТЫ И ОТСТРОЙКА ==========
children.push(H1('11. Чем вы отличаетесь от других'));

children.push(...QMulti('Кто ваши основные конкуренты в Серове и районе? Назовите 2-3 (можно без названий, просто «один мужик с бензопилой», «фирма с автовышкой» и т. д.).', 4));

children.push(...QMulti('Чем вы лучше них? Почему клиенты выбирают вас? (Опыт, аккуратность, цена, скорость, техника, договор — что реально?)', 5));

children.push(...QMulti('Что НЕ хотите видеть на сайте? (Например: «не пишите про низкие цены — мы не демпингуем», или «не делайте шаблонных фраз».) Любые ограничения.', 3));

// ========== БЛОК 12: ЗАЯВКИ ==========
children.push(H1('12. Куда присылать заявки с сайта'));

children.push(P('Форма с сайта будет отправлять заявки в Telegram. Нужно:', { bold: true }));

children.push(...Q('Есть ли у кого-то в семье Telegram, куда удобно получать уведомления? (У папы? У Тимы? Общий чат?)'));

children.push(Note('Технически: Тима создаст Telegram-бота, подключит к сайту. Заявки с сайта будут приходить в указанный чат мгновенно. От вас — только сказать, кому должны приходить уведомления.'));

// ========== БЛОК 13: ЛОГОТИП И БРЕНД ==========
children.push(H1('13. Логотип и фирменный стиль'));

children.push(...Q('Есть ли логотип? Если да — приложите файл.'));
children.push(...Q('Если нет — нужен ли (можем нарисовать) или обойдёмся красивым начертанием названия?'));
children.push(...Q('Любимые цвета / что НЕ любите в оформлении? (По умолчанию будет суровый индустриальный стиль: тёмный фон, оранжевый акцент — как цвет каски.)'));

// ========== БЛОК 14: ДОП. ==========
children.push(H1('14. Что ещё важно сказать'));

children.push(...QMulti('Любые мысли, которые не вошли в анкету. Что вы хотите, чтобы клиент понял про вас с первых секунд? Какое впечатление должен производить сайт?', 8));

// Final
children.push(Divider());
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 240, after: 120 },
  children: [new TextRun({ text: 'Спасибо!', bold: true, size: 32, color: COLOR_ACCENT })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 120 },
  children: [new TextRun({
    text: 'Как заполните — передайте анкету Тиме вместе с папкой фотографий и сканами документов. Дальше я собираю сайт.',
    size: 22,
  })],
}));

// === build ===
const doc = new Document({
  creator: 'Тима',
  title: 'Анкета для сайта — промышленный альпинизм',
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
  fs.writeFileSync('D:/Claude/projects/papa-promalp/Анкета-для-родителей-v2.docx', buf);
  console.log('OK: Анкета-для-родителей-v2.docx');
});
