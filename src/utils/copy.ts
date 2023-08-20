export async function copyToClip(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    window['$message'].success('复制成功');
  } catch (error) {
    window['$message'].warning('复制失败');
  }
}
