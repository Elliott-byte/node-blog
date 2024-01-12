import { Article } from '@blog/server/models/article.model';
import { Category, CategoryDocument } from '@blog/server/models/category.model';
import { IPaginate } from '@blog/server/mongoose/paginate';
import { Injectable } from '@nestjs/common';

function truncateString(str, maxLength = 180) {
  let result = '';
  let charCount = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    // eslint-disable-next-line no-control-regex
    if (/[^\x00-\xff]/.test(char)) {
      // 检测是否是中文字符
      charCount += 2;
    } else {
      charCount += 1;
    }
    if (charCount <= maxLength) {
      result += char;
    } else {
      break;
    }
  }
  return result + '...';
}

@Injectable()
export class ArticleService {}
