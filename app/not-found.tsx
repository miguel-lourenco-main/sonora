import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { Button } from '@kit/ui/shadcn/button';
import { Heading } from '@kit/ui/shadcn/heading';
import { Trans } from '@kit/ui/makerkit/trans';

export const metadata = { title: 'Not Found' };

const NotFoundPage = () => {
  return (
    <div className={'flex h-screen flex-1 flex-col'}>
      <div
        className={
          'container m-auto flex w-full flex-1 flex-col items-center justify-center'
        }
      >
        <div className={'flex flex-col items-center space-y-12'}>
          <div>
            <h1 className={'font-heading text-8xl font-extrabold xl:text-9xl'}>
              <Trans i18nKey={'common:pageNotFoundHeading'} />
            </h1>
          </div>

          <div className={'flex flex-col items-center space-y-8'}>
            <div className={'flex flex-col items-center space-y-2.5'}>
              <div>
                <Heading level={1}>
                  <Trans i18nKey={'common:pageNotFound'} />
                </Heading>
              </div>

              <p className={'text-muted-foreground'}>
                <Trans i18nKey={'common:pageNotFoundSubHeading'} />
              </p>
            </div>

            <Button asChild variant={'outline'}>
              <Link href={'/'}>
                <ArrowLeft className={'mr-2 h-4'} />

                <Trans i18nKey={'common:backToHomePage'} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
