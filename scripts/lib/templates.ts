/**
 * EJS template rendering
 */

import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { TEMPLATES_DIR } from './config';

/** Render an EJS template with data */
export function renderTemplate<T extends object>(templateName: string, data: T): string {
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  const template = fs.readFileSync(templatePath, 'utf-8');
  
  return ejs.render(template, data as ejs.Data, {
    filename: templatePath,
    views: [TEMPLATES_DIR]
  });
}
