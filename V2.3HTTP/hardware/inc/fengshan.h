#ifndef _FENGSHAN_H_
#define _FENGSHAN_H_

#include "stm32f10x.h"

#define Feng_GPIO_PORT GPIOA
#define Feng_GPIO_PIN GPIO_Pin_5
#define Feng_GPIO_CLK RCC_APB2Periph_GPIOA

typedef struct{
	_Bool FengSta;
}FENG_STATUS;
extern FENG_STATUS FengStatus;

typedef enum{
	FENG_OFF = 0,
	FENG_ON
}FENG_ENUM;

void Feng_Set(FENG_ENUM status);
#endif