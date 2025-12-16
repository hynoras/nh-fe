import { Avatar, Card, CardContent, CardHeader } from "@mui/material"

type CardFormProps = {
  children: React.ReactNode
  title: string
  subheader: string
  icon: React.ReactNode
}
const CardForm = (props: CardFormProps) => {
  return (
    <Card variant="outlined">
      <CardHeader
        avatar={<Avatar>{props.icon}</Avatar>}
        title={props.title}
        subheader={props.subheader}
      />
      <CardContent>{props.children}</CardContent>
    </Card>
  )
}

export default CardForm
