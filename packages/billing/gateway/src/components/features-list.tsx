import { Interval } from "../lib/interfaces";

import { Trans } from "@kit/ui/trans";
import { cn } from "@kit/ui/utils";

import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function FeaturesList(
    props: React.PropsWithChildren<{
      features: string[];
      pageCount: number;
      interval: Interval;
    }>,
  ) {
    return (
      <ul className={'flex flex-col space-y-2'}>
        {props.features.map((feature) => {
  
          let featureText = feature;
  
          if(feature === '{pagesPerMonth}'){
            featureText = `Pages per ${props.interval}: ${props.pageCount}`;
          }
  
          if(feature === '{languagesLink}'){
  
            featureText = 'Supported Languages';
  
            return (
              <ListItem key={feature}>
                <Link href={'/'} className='underline'>
                  <Trans i18nKey={featureText} defaults={featureText} />
                </Link>
              </ListItem>
            );
          }
  
          return (
            <ListItem key={featureText}>
              <Trans i18nKey={featureText} defaults={featureText} />
            </ListItem>
          );
        })}
      </ul>
    );
  }
  
  function ListItem({ children }: React.PropsWithChildren) {
    return (
      <li className={'flex items-center space-x-2.5'}>
        <CheckCircle className={'text-primary h-4 min-h-4 w-4 min-w-4'} />
  
        <span
          className={cn('text-sm', {
            ['text-secondary-foreground']: true,
          })}
        >
          {children}
        </span>
      </li>
    );
  }