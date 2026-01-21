"use client"
import { Box, Button, Skeleton, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useExperimentDetail } from "hooks/queries/experiment"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { a11yProps } from "utils/accessibility"
import ExperimentStatus from "../_components/ExperimentStatus"
import GeneralPage from "./GeneralPage"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

// Tab name mapping
const TAB_NAMES = ["general", "procedure"] as const
type TabName = (typeof TAB_NAMES)[number]

const getTabIndexFromName = (name: string | null): number => {
  if (!name) return 0
  const index = TAB_NAMES.indexOf(name as TabName)
  return index === -1 ? 0 : index
}

const ExperimentDetailPage = () => {
  const params = useParams<{ experimentId: string }>()
  const experimentId = params.experimentId
  const { data: experiment, isLoading } = useExperimentDetail(experimentId)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [value, setValue] = useState<number>(() => {
    const tabParam = searchParams.get("tab")
    return getTabIndexFromName(tabParam)
  })

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    const tabIndex = getTabIndexFromName(tabParam)
    if (tabIndex !== value) {
      setValue(tabIndex)
    }
  }, [searchParams, value])

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    const tabName = TAB_NAMES[newValue]
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tabName)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <Stack className="h-[82vh]" direction="column">
      {/* Header */}
      {isLoading ? (
        <Stack
          direction={"row"}
          spacing={2}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Skeleton variant="text" width={300} height={32} />
            <Skeleton variant="rounded" width={80} height={24} />
          </Stack>
          <Skeleton variant="rounded" width={120} height={24} />
        </Stack>
      ) : (
        <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Typography variant="h5" fontWeight="bold">
              {experiment?.data?.title}
            </Typography>
            <ExperimentStatus
              status={experiment?.data?.status || "running"}
              size="medium"
              isChip
            />
          </Stack>
          <Button className="normal-case" variant="outlined">
            Start planning
          </Button>
        </Stack>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {isLoading ? (
          <Stack direction="row" spacing={2}>
            <Skeleton variant="text" width={100} height={48} />
            <Skeleton variant="text" width={100} height={48} />
          </Stack>
        ) : (
          <Tabs value={value} onChange={handleChange} aria-label="experiment tabs">
            <Tab className="normal-case" label="Overview" {...a11yProps(0)} />
            <Tab className="normal-case" label="Procedure" {...a11yProps(1)} />
          </Tabs>
        )}
      </Box>

      <TabPanel value={value} index={0}>
        <GeneralPage />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant="h6">Procedure</Typography>
      </TabPanel>
    </Stack>
  )
}

export default ExperimentDetailPage
