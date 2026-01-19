"use client"
import { Avatar, Box, Chip, Skeleton, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useExperimentDetail } from "hooks/queries/experiment"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { a11yProps } from "utils/accessibility"
import ExperimentStatus from "../_components/ExperimentStatus"
import GeneralPage from "../_components/GeneralPage"

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

  if (isLoading) {
    return (
      <Stack className="h-[82vh] overflow-y-scroll" direction="column">
        {/* Header Skeleton */}
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Stack>

        {/* Tabs Skeleton */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
          <Stack direction="row" spacing={2}>
            <Skeleton variant="text" width={100} height={48} />
            <Skeleton variant="text" width={100} height={48} />
          </Stack>
        </Box>

        {/* Content Skeleton */}
        <Box sx={{ pt: 3 }}>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Box>
      </Stack>
    )
  }

  return (
    <Stack className="h-[82vh] overflow-y-scroll" direction="column">
      {/* Header */}
      <Stack direction={"row"} spacing={2} alignItems={"center"}>
        <Avatar>
          <ExperimentStatus status={experiment?.data?.status || "running"} />
        </Avatar>
        <Typography variant="h5">{experiment?.data?.title}</Typography>
        <Chip label={experiment?.data?.type} size="small" />
      </Stack>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="experiment tabs">
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Procedure" {...a11yProps(1)} />
        </Tabs>
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
