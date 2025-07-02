const convertToChineseCurrency = (amount: number) => {
  if (amount === 0) {
    return '零元整'
  }
  const units = ['个', '拾', '佰', '仟', '万', '拾万', '佰万', '仟万', '亿']
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  let [integer, decimal] = amount.toString().split('.')
  let chineseInteger = ''
  let chineseDecimal = ''
  let unitIndex = 0
  let zeroFlag = false
  for (let i = integer.length - 1; i >= 0; i--) {
    const digit = integer[i]
    const digitValue = parseInt(digit)
    if (digitValue !== 0) {
      chineseInteger = digits[digitValue] + units[unitIndex] + chineseInteger
      zeroFlag = false
    } else if (!zeroFlag) {
      chineseInteger = digits[digitValue] + chineseInteger
      zeroFlag = true
    }
    unitIndex++
  }
  chineseInteger = chineseInteger.replace(/零{2,}/g, '零').replace(/零$/, '')
  if (decimal) {
    chineseDecimal = '点'
    for (let i = 0; i < decimal.length; i++) {
      chineseDecimal += digits[parseInt(decimal[i])]
    }
  }
  return chineseInteger + chineseDecimal + '元整'
}

export default convertToChineseCurrency
