#include "fengshan.h"
FENG_STATUS FengStatus;
/**
*风扇初始化函数
*/
void Feng_Init(void){
	GPIO_InitTypeDef gpioInitStruct;
	RCC_APB2PeriphClockCmd(Feng_GPIO_CLK,ENABLE);
	
	gpioInitStruct.GPIO_Mode = GPIO_Mode_Out_PP;
	gpioInitStruct.GPIO_Pin = Feng_GPIO_PIN;
	gpioInitStruct.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_Init(Feng_GPIO_PORT,&gpioInitStruct);
	
	Feng_Set(FENG_OFF);
}

void Feng_Set(FENG_ENUM status){
	GPIO_WriteBit(Feng_GPIO_PORT,Feng_GPIO_PIN,status!=FENG_ON ? Bit_SET : Bit_RESET);
	FengStatus.FengSta = status; 
}