// TODO: maybe leave it here for refactoring
export const a11yProps = (index: number) => {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`
  }
}
