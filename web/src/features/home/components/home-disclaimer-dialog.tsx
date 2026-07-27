/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export const HOME_DISCLAIMER_STORAGE_KEY = 'home_disclaimer_accepted'

const TECH_QQ_GROUP = '1090552599'

/**
 * First-visit disclaimer modal on the home page.
 * Requires checkbox acknowledgement before enter; persists acceptance in localStorage.
 */
export function HomeDisclaimerDialog() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(HOME_DISCLAIMER_STORAGE_KEY)
      if (accepted !== '1') {
        setOpen(true)
      }
    } catch {
      setOpen(true)
    }
  }, [])

  const handleEnter = () => {
    if (!acknowledged) return
    try {
      localStorage.setItem(HOME_DISCLAIMER_STORAGE_KEY, '1')
    } catch {
      // Ignore storage failures; still allow entry for this session.
    }
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      disablePointerDismissal
      onOpenChange={(nextOpen) => {
        // Only allow close after acknowledgement via the enter button.
        if (!nextOpen) return
        setOpen(nextOpen)
      }}
    >
      <DialogContent showCloseButton={false} className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-lg leading-snug'>
            {t('Welcome to Yunex AI Experimental Platform')}
          </DialogTitle>
          <DialogDescription className='sr-only'>
            {t('Disclaimer')}
          </DialogDescription>
        </DialogHeader>

        <div className='max-h-[min(60vh,28rem)] space-y-3 overflow-y-auto pr-1 text-sm leading-relaxed'>
          <p className='text-foreground font-semibold'>{t('Disclaimer')}</p>
          <p className='text-muted-foreground'>
            {t(
              'This site is an AI technology experimental platform built by an independent developer, mainly for AI application development, API testing, and technical exchange and learning.'
            )}
          </p>
          <p className='text-muted-foreground'>
            {t(
              'This site is intended only for personal and internal team use. It does not provide commercial services and is not used for any commercial profit activities.'
            )}
          </p>
          <p className='text-muted-foreground'>
            {t(
              'This site depends on third-party AI service APIs and cannot guarantee the continuous availability of those services. Users must comply with relevant service agreements, platform rules, and laws and regulations, and must not use this site for any illegal purposes.'
            )}
          </p>
          <p className='text-muted-foreground'>
            {t('Thank you for your understanding and support.')}
          </p>
          <p className='text-foreground pt-1 text-sm font-medium'>
            {t('Technical exchange QQ group: {{group}}', {
              group: TECH_QQ_GROUP,
            })}
          </p>
        </div>

        <div className='flex items-start gap-2.5'>
          <Checkbox
            id='home-disclaimer-ack'
            checked={acknowledged}
            onCheckedChange={(checked) => {
              setAcknowledged(checked === true)
            }}
          />
          <Label
            htmlFor='home-disclaimer-ack'
            className='cursor-pointer text-sm leading-snug font-normal'
          >
            {t('I have read and understand')}
          </Label>
        </div>

        <DialogFooter className='bg-transparent'>
          <Button
            className='w-full sm:w-auto'
            disabled={!acknowledged}
            onClick={handleEnter}
          >
            {t('Enter the site')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
