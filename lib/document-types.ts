// 公文类型定义和字段配置

export type DocumentType = '通知' | '请示' | '报告' | '合同' | '会议纪要' | '工作总结';

export interface FieldConfig {
  name: string;
  label: string;
  placeholder: string;
  type: 'input' | 'textarea';
  required: boolean;
}

export interface DocumentTypeConfig {
  type: DocumentType;
  icon: string;
  description: string;
  fields: FieldConfig[];
}

export const documentTypes: DocumentTypeConfig[] = [
  {
    type: '通知',
    icon: '📢',
    description: '用于传达事项、布置工作',
    fields: [
      { name: 'issuer', label: '发文单位', placeholder: '如：广西现代物流集团有限公司', type: 'input', required: true },
      { name: 'recipients', label: '收文范围', placeholder: '如：各部门、各子公司', type: 'input', required: true },
      { name: 'subject', label: '通知事项要点', placeholder: '请输入通知的核心内容要点，AI将为您生成完整规范公文...', type: 'textarea', required: true },
      { name: 'date', label: '发文日期', placeholder: '如：2025年1月8日', type: 'input', required: false },
    ],
  },
  {
    type: '请示',
    icon: '📤',
    description: '用于请求上级审批指示',
    fields: [
      { name: 'requestor', label: '请示单位', placeholder: '如：广西现代物流集团有限公司', type: 'input', required: true },
      { name: 'reason', label: '请示事由', placeholder: '请简述请示的背景、原因及具体请求事项...', type: 'textarea', required: true },
    ],
  },
  {
    type: '报告',
    icon: '📊',
    description: '用于汇报工作、反映情况',
    fields: [
      { name: 'reporter', label: '报告单位', placeholder: '如：广西现代物流集团有限公司', type: 'input', required: true },
      { name: 'reportTo', label: '报告对象', placeholder: '如：广西壮族自治区国资委', type: 'input', required: true },
      { name: 'content', label: '报告内容要点', placeholder: '请输入报告的主要内容要点，包括工作进展、成效、问题等...', type: 'textarea', required: true },
    ],
  },
  {
    type: '合同',
    icon: '📝',
    description: '用于约定双方权利义务',
    fields: [
      { name: 'partyA', label: '甲方', placeholder: '如：广西现代物流集团有限公司', type: 'input', required: true },
      { name: 'partyB', label: '乙方', placeholder: '如：XX有限公司', type: 'input', required: true },
      { name: 'contractSubject', label: '合同标的', placeholder: '请描述合同的主要内容和标的物...', type: 'textarea', required: true },
      { name: 'obligations', label: '权利义务', placeholder: '请说明双方的主要权利和义务...', type: 'textarea', required: true },
      { name: 'validity', label: '有效期', placeholder: '如：2025年1月1日至2025年12月31日', type: 'input', required: false },
    ],
  },
  {
    type: '会议纪要',
    icon: '📋',
    description: '用于记录会议决议事项',
    fields: [
      { name: 'meetingName', label: '会议名称', placeholder: '如：2025年第一季度工作部署会', type: 'input', required: true },
      { name: 'timePlace', label: '时间地点', placeholder: '如：2025年1月8日上午9:00，公司三楼会议室', type: 'input', required: true },
      { name: 'attendees', label: '参会人员', placeholder: '请列出主要参会人员...', type: 'textarea', required: true },
      { name: 'resolutions', label: '议题决议', placeholder: '请输入会议讨论的主要议题和形成的决议...', type: 'textarea', required: true },
    ],
  },
  {
    type: '工作总结',
    icon: '📈',
    description: '用于阶段性成果回顾',
    fields: [
      { name: 'period', label: '时间范围', placeholder: '如：2024年度 / 2025年第一季度', type: 'input', required: true },
      { name: 'workContent', label: '工作内容', placeholder: '请概述主要开展的工作内容...', type: 'textarea', required: true },
      { name: 'achievements', label: '成果亮点', placeholder: '请列出取得的主要成果和亮点...', type: 'textarea', required: true },
      { name: 'improvements', label: '改进方向', placeholder: '请说明存在的问题和下一步改进方向...', type: 'textarea', required: false },
    ],
  },
];

export function getDocumentTypeConfig(type: DocumentType): DocumentTypeConfig | undefined {
  return documentTypes.find(config => config.type === type);
}
