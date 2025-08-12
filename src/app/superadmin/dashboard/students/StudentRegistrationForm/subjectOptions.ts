import { SchoolLevel } from '../../../contexts/types/schoolData'; // 適宜パスを調整

const SUBJECT_OPTIONS: Record<SchoolLevel, string[]> = {
  小学校: ['算数', '国語', '理科', '社会', '英語'],
  中学校: ['英語', '数学', '国語', '理科', '社会'],
  高等学校: [
    '英語', '数学I', '数学II', '数学A', '数学B',
    '物理', '化学', '生物', '日本史', '世界史', '国語', '古文',
  ],
  通信制: ['英語', '数学', '国語', '理科', '社会'],
};

export default SUBJECT_OPTIONS;
