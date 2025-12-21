"use client"

import { Box, Chip, Popover, Stack } from "@mui/material"
import Overflow from "rc-overflow"
import { useId, useState } from "react"

type ChipOverflowListProps<T> = {
  items: T[]
  getItemLabel?: (item: T) => string
  getItemId?: (item: T) => string | number
  renderItem?: (item: T) => React.ReactNode
  className?: string
  chipClassName?: string
  maxCount?: number | "responsive"
  popoverId?: string
  popoverMaxHeight?: number
}

const ChipOverflowList = <T extends Record<string, unknown>>({
  items,
  getItemLabel = (item) => String(item.name ?? ""),
  getItemId = (item) => String(item.id ?? ""),
  renderItem,
  className = "flex gap-2",
  maxCount = "responsive",
  popoverId,
  popoverMaxHeight = 150
}: ChipOverflowListProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const generatedId = useId()
  const uniquePopoverId = popoverId ?? `chip-overflow-popover-${generatedId}`

  const open = Boolean(anchorEl)

  const handleTogglePopover = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl === event.currentTarget) {
      // If clicking the same element, close the popover
      setAnchorEl(null)
    } else {
      // Otherwise, open/update the popover
      setAnchorEl(event.currentTarget)
    }
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const defaultRenderItem = (item: T) => (
    <Chip key={getItemId(item)} label={getItemLabel(item)} />
  )

  const itemRenderer = renderItem ?? defaultRenderItem

  return (
    <Overflow
      className={className}
      data={items}
      renderItem={(item: T) => itemRenderer(item)}
      renderRest={(omittedItems) => (
        <>
          <Popover
            id={uniquePopoverId}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left"
            }}
            slotProps={{
              paper: {
                sx: {
                  maxHeight: popoverMaxHeight,
                  maxWidth: 300,
                  overflowY: "auto"
                }
              }
            }}
          >
            <Stack
              className="flex-wrap mt-1 mb-1"
              direction="row"
              spacing={0.5}
            >
              {omittedItems.map((item) => (
                <Chip className="m-1" key={getItemId(item)} label={getItemLabel(item)} />
              ))}
            </Stack>
          </Popover>
          <Chip
            aria-owns={open ? uniquePopoverId : undefined}
            aria-haspopup="true"
            label={`+${omittedItems.length}`}
            onClick={handleTogglePopover}
          />
        </>
      )}
      maxCount={maxCount}
      component={Box}
    />
  )
}

export default ChipOverflowList

