import {
    generateCalendarDays,
    getDayReading,
    getJapaneseYearReading,
    DAYS,
    DAYS_JA,
    DAYS_JA_READING,
    MONTHS,
    MONTHS_JA,
    MONTHS_JA_READING
} from './calendar';
import { HOLIDAYS } from './holidays';
import * as FileSystem from 'expo-file-system/legacy';

const generateHtmlContent = async (year: number, monthIndex: number, imageUri?: string, isSimpleMode = false) => {
    // Note: imageUri here can be a full data URI (Base64) or a local file:// path.
    // We convert local files to Base64 for better PDF rendering in the WebView.
    let base64Image = imageUri;

    if (imageUri && imageUri.startsWith('file://')) {
        try {
            const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
            base64Image = `data:image/jpeg;base64,${base64}`;
        } catch (e) {
            console.error('Failed to read image for PDF:', e);
        }
    }

    const days = generateCalendarDays(year, monthIndex);

    // Grid generation
    let gridHtml = '';
    const rows = Math.ceil(days.length / 7);
    const isSixWeeks = rows > 5;

    for (let i = 0; i < rows; i++) {
        gridHtml += '<tr>';
        for (let j = 0; j < 7; j++) {
            const dayIndex = i * 7 + j;
            const day = days[dayIndex];

            if (!day) {
                gridHtml += '<td class="day empty"></td>';
                continue;
            }

            const dateKey = `${year}-${monthIndex + 1}-${day}`;
            const holidayName = HOLIDAYS[dateKey];
            const dayReading = isSimpleMode ? getDayReading(day) : undefined;
            const isSunday = j === 0;
            const isSaturday = j === 6;

            let colorClass = 'text-normal';
            if (isSunday || holidayName) colorClass = 'text-red';
            else if (isSaturday) colorClass = 'text-blue';

            gridHtml += `
                <td class="day">
                    <div class="day-content">
                        <div class="day-number ${colorClass}">${day}</div>
                        ${dayReading ? `<div class="day-reading">${dayReading}</div>` : ''}
                        ${holidayName ? `<div class="holiday-name">${holidayName}</div>` : ''}
                    </div>
                </td>
            `;
        }
        gridHtml += '</tr>';
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
            @page { margin: 0; size: A4; }
            body { margin: 0; padding: 0; font-family: 'Times New Roman', serif; background: white; }
            .page { width: 210mm; height: 297mm; position: relative; overflow: hidden; page-break-after: always; display: flex; flex-direction: column; }
            
            .image-container {
                width: 100%;
                height: 148mm; /* Half page approx */
                flex-shrink: 0;
                background-color: #f3f4f6;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }
            .image-container img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .image-placeholder {
                color: #ccc;
                font-size: 24px;
                font-family: sans-serif;
            }

            .content {
                flex: 1;
                padding: 20px 40px;
                display: flex;
                flex-direction: column;
            }

            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .month-title {
                font-size: 48px;
                font-weight: bold;
                margin: 0;
                color: #2d3436;
            }
            .year-subtitle {
                font-size: 18px;
                color: #b2bec3;
                letter-spacing: 4px;
                margin-top: 5px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                table-layout: fixed;
            }
            
            th {
                text-align: center;
                font-size: 14px;
                color: #b2bec3;
                text-transform: uppercase;
                padding-bottom: 10px;
                font-family: sans-serif;
            }

            td.day {
                height: 80px;
                vertical-align: top;
                border-top: 1px solid #eee;
                padding: 5px;
            }

            table.six-weeks td.day {
                height: 66px;
                padding: 3px 5px;
            }

            table.six-weeks .day-number {
                font-size: 20px;
            }

            .simple-mode .day-number {
                font-size: 26px;
                line-height: 1.1;
            }

            .simple-mode table.six-weeks .day-number {
                font-size: 22px;
                line-height: 1.1;
            }

            .day-reading {
                font-size: 10px;
                color: #64748b;
                margin-top: 1px;
                font-family: sans-serif;
            }

            .th-reading {
                display: block;
                font-size: 10px;
                font-weight: normal;
                color: #94a3b8;
                margin-top: 1px;
            }

            .month-reading {
                font-size: 18px;
                color: #64748b;
                font-weight: normal;
                margin-left: 10px;
            }

            .year-reading {
                font-size: 13px;
                color: #64748b;
                letter-spacing: normal;
                margin-left: 6px;
                font-family: sans-serif;
            }
            
            .day-number {
                font-size: 24px;
                font-weight: 500;
            }
            
            .holiday-name {
                font-size: 10px;
                color: #ef4444;
                margin-top: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .text-normal { color: #2d3436; }
            .text-red { color: #ef4444; }
            .text-blue { color: #3b82f6; }
        </style>
    </head>
    <body>
        <div class="page ${isSimpleMode ? 'simple-mode' : ''}">
            <div class="image-container">
                ${base64Image
            ? `<img src="${base64Image}" />`
            : '<div class="image-placeholder">No Photo</div>'
        }
            </div>
            
            <div class="content">
                <div class="header">
                    <h1 class="month-title">${isSimpleMode
            ? `${MONTHS_JA[monthIndex]}<span class="month-reading">${MONTHS_JA_READING[monthIndex]}</span>`
            : MONTHS[monthIndex]
        }</h1>
                    <div class="year-subtitle">${isSimpleMode
            ? `${year}年<span class="year-reading">${getJapaneseYearReading(year)}</span>`
            : year
        }</div>
                </div>

                <table class="${isSixWeeks ? 'six-weeks' : ''}">
                    <thead>
                        <tr>
                            ${isSimpleMode
            ? DAYS_JA.map((d, idx) => `<th>${d}<span class="th-reading">${DAYS_JA_READING[idx]}</span></th>`).join('')
            : DAYS.map(d => `<th>${d}</th>`).join('')
        }
                        </tr>
                    </thead>
                    <tbody>
                        ${gridHtml}
                    </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default generateHtmlContent;
