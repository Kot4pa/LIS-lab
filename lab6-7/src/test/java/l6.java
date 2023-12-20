import com.codeborne.selenide.Condition;
import org.junit.Test;

import static com.codeborne.selenide.Selenide.*;

public class l6 {
    @Test
    public void firstTest(){
        open("https://bouquet-delivery.ru/about/");
    }
    @Test
    public void FirstTestGoogle(){
        open("https://www.google.ru/");
        $x("//textarea[@name='q']").setValue("Андрияшкин Степан Андреевич").pressEnter();
        sleep(10000);
        $x("//div[@id='result-stats']").shouldBe(Condition.visible);
    }
    @Test
    public void secondTest() {
        open("https://bouquet-delivery.ru/about/");
        $x("//a[@class='header-logo-wrap']").click();
        sleep(5000);
        $x("//li[@id='menu-item-7125']").click();
        sleep(5000);
        $x("//a[@href='https://bouquet-delivery.ru/products/buket-80/']").click();
        sleep(5000);
        $x("//button[@class='product-single__add-cart-button']").click();
        sleep(5000);
        $x("//a[@title='Корзина']").click();
        sleep(5000);
        $x("//button[@class='cart__product-item__remove-button']").click();
        sleep(5000);
        $x("//li[@id='menu-item-700']").hover();
        sleep(5000);
        $x("//li[@id='menu-item-11332']").hover();
        sleep(5000);
        $x("//li[@id='menu-item-6453']").click();
        sleep(5000);
        $x("//li[@data-count='2']").click();
        sleep(5000);
        $x("//a[@href='/product_category/populyarnye/']").click();
        sleep(5000);
        $x("//span[@class='header-right-nav__item header-bottom-main-container__search']").click();
        sleep(5000);
        $x("//input[@type='search']").setValue("25 Желтых роз с эвкалиптом в шляпной коробке").pressEnter();
        sleep(5000);
        $x("//div[@class='product-card-extended__img']").click();
        sleep(5000);
        $x("//button[@class='quick-view__body__offer__footer__add-cart-button']").click();
        sleep(5000);
        $x("//a[@title='Корзина']").click();
        sleep(5000);
        $x("//button[@class='cart__next-button']").click();
        sleep(10000);
    }
}