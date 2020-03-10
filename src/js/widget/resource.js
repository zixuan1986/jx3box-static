const { JX3BOX } = require('@jx3box/jx3box-common');
import Filter from '../utils/filter.js';
var $ = jQuery

async function load_resource(ele,type,query,multiple=false){

    //清空
    $(ele).html('')

    let result = await get_resource(type,query)
    let html = ''
    if(result.length){
        $.each(result,async function (i,o){

            //过滤描述字段
            if(o.Desc){
                o.Desc = await Filter(o.Desc)
            }

            html = render_resource(type,o)
            //$(`#m-${type}-list`).append(html)
            $(ele).append(html)
        })
    }else{
        if(!multiple){
            html = '<p class="u-null">未检索到相关条目</p>'
            //$(`#m-${type}-list`).html(html)
            $(ele).html(html)
        }
    }
}
function get_resource(type,query){
    return new Promise((resolve,reject)=>{
        $.ajax({
                url:JX3BOX.__node + `${type}/` + query,
                type:'GET',
                success:function (data){
                    resolve(data)
                },
                error:function (err){
                    reject(err)
                }
        })
    })
}
function render_resource(type,o){

    let tpl = {
        skill : `<li class="u-item">
                    <span class="u-id">ID:${o.SkillID}</span>
                    <img class="u-pic" title="IconID:${o.IconID}" src="${JX3BOX.__iconPath}${o.IconID}.png">
                    <span class="u-name">${o.Name}</span>
                    <span class="u-desc">${o.Desc}</span>
                    <span class="u-remark">Level : ${o.Level}</span>
                    <span class="u-remark">Remark : ${o.Remark}</span>
                </li>`,
        buff : `<li class="u-item">
                    <span class="u-id">ID:${o.BuffID}</span>
                    <img class="u-pic" title="IconID:${o.IconID}" src="${JX3BOX.__iconPath}${o.IconID}.png">
                    <span class="u-name">${o.Name}</span>
                    <span class="u-desc">${o.Desc}</span>
                    <span class="u-remark">Level : ${o.Level}</span>
                    <span class="u-remark">Remark : ${o.Remark}</span>
                </li>`,
        npc : `<li class="u-item u-raw">
                <span class="u-id">ID:${o.ID}</span>
                <span class="u-name">${o.Name}</span>
                <span class="u-desc">称谓<em>Title</em>${o.Title}</span>
                <span class="u-desc">等级<em>Level:</em>${o.Level}</span>
                <span class="u-desc">强度<em>Intensity</em>${o.Intensity}</span>
                <span class="u-desc">地图<em>MapName</em>${o.MapName}</span>
                <span class="u-desc">备注<em>_Notation</em>${o._Notation}</span>
                
                <span class="u-desc">血量<em>MaxLife</em>${o.MaxLife}</span>
                <span class="u-desc">蓝量<em>MaxMana</em>${o.MaxMana}</span>
                <span class="u-desc">跑速<em>RunSpeed</em>${o.RunSpeed}</span>
                <span class="u-desc">移速<em>WalkSpeed</em>${o.WalkSpeed}</span>
                <span class="u-desc" title="攻击补偿距离/64">体积<em>TouchRange</em>${o.TouchRange}</span>
                
                <span class="u-desc">识破<em>Sense</em>${o.Sense}</span>
                <span class="u-desc">闪避<em>Dodge</em>${o.Dodge}</span>
                <span class="u-desc">外功防御<em>PhysicsShieldBase</em>${o.PhysicsShieldBase}</span>
                <span class="u-desc">混元防御<em>NeutralMagicDefence</em>${o.NeutralMagicDefence}</span>
                <span class="u-desc">阳性防御<em>SolarMagicDefence</em>${o.SolarMagicDefence}</span>
                <span class="u-desc">阴性防御<em>LunarMagicDefence</em>${o.LunarMagicDefence}</span>
                <span class="u-desc">毒性防御<em>PoisonMagicDefence</em>${o.PoisonMagicDefence}</span>
                <span class="u-desc">外功会心<em>PhysicsCriticalStrike</em>${o.PhysicsCriticalStrike}</span>
                <span class="u-desc">混元会心<em>NeutralCriticalStrike</em>${o.NeutralCriticalStrike}</span>
                <span class="u-desc">阳性会心<em>SolarCriticalStrike</em>${o.SolarCriticalStrike}</span>
                <span class="u-desc">阴性会心<em>LunarCriticalStrike</em>${o.LunarCriticalStrike}</span>
                <span class="u-desc">毒性会心<em>PoisonCriticalStrike</em>${o.PoisonCriticalStrike}</span>
                <span class="u-desc">外功命中<em>PhysicsAttackHit</em>${o.PhysicsAttackHit}</span>
                <span class="u-desc">混元命中<em>NeutralMagicHit</em>${o.NeutralMagicHit}</span>
                <span class="u-desc">阳性命中<em>SolarMagicHit</em>${o.SolarMagicHit}</span>
                <span class="u-desc">阴性命中<em>LunarMagicHit</em>${o.LunarMagicHit}</span>
                <span class="u-desc">毒性命中<em>PoisonMagicHit</em>${o.PoisonMagicHit}</span>
                <span class="u-desc">血条是否可见<em>CanSeeLifeBar</em>${o.CanSeeLifeBar}</span>
                <span class="u-desc">是否可被选择<em>IsSelectable</em>${o.IsSelectable}</span>
                <span class="u-remark">ReviveTime:${o.ReviveTime}</span>
                <span class="u-remark">ImmunityMask:${o.ImmunityMask}</span>
                <span class="u-remark">ScriptName:${o.ScriptName}</span>
            </li>`,
        npc2 : `<li class="u-item u-raw">
            <span class="u-id">ID:${o.ID}</span>
            <span class="u-name">${o.Name}</span>
            <span class="u-desc">称谓<em>Title</em>${o.Title}</span>
            <span class="u-desc">等级<em>Level:</em>${o.Level}</span>
            <span class="u-desc">强度<em>Intensity</em>${o.Intensity}</span>
            <span class="u-desc">地图<em>MapName</em>${o.MapName}</span>
            <span class="u-desc">备注<em>_Notation</em>${o._Notation}</span>
            
            <span class="u-desc">血量<em>MaxLife</em>${o.MaxLife}</span>
            <span class="u-desc">蓝量<em>MaxMana</em>${o.MaxMana}</span>
            <span class="u-desc">跑速<em>RunSpeed</em>${o.RunSpeed}</span>
            <span class="u-desc">移速<em>WalkSpeed</em>${o.WalkSpeed}</span>
            <span class="u-desc" title="攻击补偿距离/64">体积<em>TouchRange</em>${o.TouchRange}</span>
            
            <span class="u-desc">识破<em>Sense</em>${o.Sense}</span>
            <span class="u-desc">闪避<em>Dodge</em>${o.Dodge}</span>
            <span class="u-desc">外功防御<em>PhysicsShieldBase</em>${o.PhysicsShieldBase}</span>
            <span class="u-desc">混元防御<em>NeutralMagicDefence</em>${o.NeutralMagicDefence}</span>
            <span class="u-desc">阳性防御<em>SolarMagicDefence</em>${o.SolarMagicDefence}</span>
            <span class="u-desc">阴性防御<em>LunarMagicDefence</em>${o.LunarMagicDefence}</span>
            <span class="u-desc">毒性防御<em>PoisonMagicDefence</em>${o.PoisonMagicDefence}</span>
            <span class="u-desc">外功会心<em>PhysicsCriticalStrike</em>${o.PhysicsCriticalStrike}</span>
            <span class="u-desc">混元会心<em>NeutralCriticalStrike</em>${o.NeutralCriticalStrike}</span>
            <span class="u-desc">阳性会心<em>SolarCriticalStrike</em>${o.SolarCriticalStrike}</span>
            <span class="u-desc">阴性会心<em>LunarCriticalStrike</em>${o.LunarCriticalStrike}</span>
            <span class="u-desc">毒性会心<em>PoisonCriticalStrike</em>${o.PoisonCriticalStrike}</span>
            <span class="u-desc">外功命中<em>PhysicsAttackHit</em>${o.PhysicsAttackHit}</span>
            <span class="u-desc">混元命中<em>NeutralMagicHit</em>${o.NeutralMagicHit}</span>
            <span class="u-desc">阳性命中<em>SolarMagicHit</em>${o.SolarMagicHit}</span>
            <span class="u-desc">阴性命中<em>LunarMagicHit</em>${o.LunarMagicHit}</span>
            <span class="u-desc">毒性命中<em>PoisonMagicHit</em>${o.PoisonMagicHit}</span>
            <span class="u-desc">血条是否可见<em>CanSeeLifeBar</em>${o.CanSeeLifeBar}</span>
            <span class="u-desc">是否可被选择<em>IsSelectable</em>${o.IsSelectable}</span>
            <span class="u-remark">ReviveTime:${o.ReviveTime}</span>
            <span class="u-remark">ImmunityMask:${o.ImmunityMask}</span>
            <span class="u-remark">ScriptName:${o.ScriptName}</span>
        </li>`,
        skill2 : `<li class="u-item u-raw">
                    <span class="u-id">ID:${o.SkillID}</span>
                    <span class="u-name">${o.SkillName}</span>
                    <span class="u-desc" title="区分物理或魔法等">类型<em>KindType</em>${o.KindType}</span>
                    <span class="u-desc" title="区分眩晕或伤害等">功能<em>FunctionType</em>${o.FunctionType}</span>
                    <span class="u-desc" title="范围或指定目标等">释放方式<em>CastMode</em>${o.CastMode}</span>
                    <span class="u-desc" title="是否为被动">被动<em>IsPassiveSkill</em>${o.IsPassiveSkill}</span>
                    <span class="u-desc" title="是否为通道/引导技能">通道<em>IsChannelSkill</em>${o.IsChannelSkill}</span>
                    <span class="u-desc">可否打断<em>CauseBeatBreak</em>${o.CauseBeatBreak}</span>
                    <span class="u-desc">可否打退<em>CauseBeatBack</em>${o.CauseBeatBack}</span>
                    <span class="u-desc" title="是否受障碍影响">3D碰撞<em>Use3DObstacle</em>${o.Use3DObstacle}</span>
                    <span class="u-desc">对玩家生效<em>TargetTypePlayer</em>${o.TargetTypePlayer}</span>
                    <span class="u-desc">对NPC生效<em>TargetTypeNpc</em>${o.TargetTypeNpc}</span>
                    <span class="u-desc">小队生效<em>TargetRelationParty</em>${o.TargetRelationParty}</span>
                    <span class="u-desc">团队生效<em>TargetRelationRaid</em>${o.TargetRelationRaid}</span>
                    <span class="u-desc">无视增益<em>IgnorePositiveShield</em>${o.IgnorePositiveShield}</span>
                    <span class="u-desc">无视减益<em>IgnoreNegativeShield</em>${o.IgnoreNegativeShield}</span>
                    <span class="u-desc">所属门派<em>BelongSchool</em>${o.BelongSchool}</span>
                    <span class="u-desc">所属套路<em>BelongKungfu</em>${o.BelongKungfu}</span>
                    <span class="u-desc">最高等级<em>MaxLevel</em>${o.MaxLevel}</span>
                    <span class="u-desc">是否需求武器<em>WeaponRequest</em>${o.WeaponRequest}</span>
                    <span class="u-desc">是否需要上马<em>SelfHorseStateRequest</em>${o.SelfHorseStateRequest}</span>
                    <span class="u-desc">需要脱战释放<em>NeedOutOfFight</em>${o.NeedOutOfFight}</span>
                    <span class="u-remark">Design_Effect:${o.Design_Effect}</span>
                    <span class="u-remark">ScriptFile:${o.ScriptFile}</span>
                </li>`,
        buff2 : `<li class="u-item u-raw">
                    <span class="u-id">ID:${o.ID}</span>
                    <span class="u-name">${o.Name}</span>
                    <span class="u-desc">等级<em>Level</em>${o.Level}</span>
                    <span class="u-desc">门派<em>Useage</em>${o.Useage}</span>
                    <span class="u-desc">是否隐藏<em>Hide</em>${o.Hide}</span>
                    <span class="u-desc">强度/优先级<em>Intensity</em>${o.Intensity}</span>
                    <span class="u-desc">功能<em>FunctionType</em>${o.FunctionType}</span>
                    <span class="u-desc">能否驱散<em>DetachType</em>${o.DetachType}</span>
                    <span class="u-desc">能否主动取消<em>CanCancel</em>${o.CanCancel}</span>
                    <span class="u-desc">能否被偷取<em>CanBeSteal</em>${o.CanBeSteal}</span>
                    <span class="u-desc">能否叠加<em>IsStackable</em>${o.IsStackable}</span>
                    <span class="u-desc">最大可叠加层数<em>MaxStackNum</em>${o.MaxStackNum}</span>
                    <span class="u-desc">跳数<em>Count</em>${o.Count}</span>
                    <span class="u-desc">作用间隔<em>Interval</em>${o.Interval}帧</span>
                    <span class="u-desc">最小间隔<em>MinInterval</em>${o.MinInterval}帧</span>
                    <span class="u-desc">最大间隔<em>MaxInterval</em>${o.MaxInterval}帧</span>
                    <span class="u-desc">附加效果1号位<em>${o.BeginAttrib1}</em>${o.BeginValue1A} ／ ${o.BeginValue1B}</span>
                    <span class="u-desc">附加效果2号位<em>${o.BeginAttrib2}</em>${o.BeginValue2A} ／ ${o.BeginValue2B}</span>
                    <span class="u-desc">附加效果3号位<em>${o.BeginAttrib3}</em>${o.BeginValue3A} ／ ${o.BeginValue3B}</span>
                    <span class="u-desc">附加效果4号位<em>${o.BeginAttrib4}</em>${o.BeginValue4A} ／ ${o.BeginValue4B}</span>
                    <span class="u-desc">附加效果5号位<em>${o.BeginAttrib5}</em>${o.BeginValue5A} ／ ${o.BeginValue5B}</span>
                    <span class="u-desc">附加效果6号位<em>${o.BeginAttrib6}</em>${o.BeginValue6A} ／ ${o.BeginValue6B}</span>
                    <span class="u-desc">附加效果7号位<em>${o.BeginAttrib7}</em>${o.BeginValue7A} ／ ${o.BeginValue7B}</span>
                    <span class="u-desc">附加效果8号位<em>${o.BeginAttrib8}</em>${o.BeginValue8A} ／ ${o.BeginValue8B}</span>
                    <span class="u-desc">附加效果9号位<em>${o.BeginAttrib9}</em>${o.BeginValue9A} ／ ${o.BeginValue9B}</span>
                    <span class="u-desc">附加效果10号位<em>${o.BeginAttrib10}</em>${o.BeginValue10A} ／ ${o.BeginValue10B}</span>
                    <span class="u-desc">附加效果11号位<em>${o.BeginAttrib11}</em>${o.BeginValue11A} ／ ${o.BeginValue11B}</span>
                    <span class="u-desc">附加效果12号位<em>${o.BeginAttrib12}</em>${o.BeginValue12A} ／ ${o.BeginValue12B}</span>
                    <span class="u-desc">附加效果13号位<em>${o.BeginAttrib13}</em>${o.BeginValue13A} ／ ${o.BeginValue13B}</span>
                    <span class="u-desc">附加效果14号位<em>${o.BeginAttrib14}</em>${o.BeginValue14A} ／ ${o.BeginValue14B}</span>
                    <span class="u-desc">附加效果15号位<em>${o.BeginAttrib15}</em>${o.BeginValue15A} ／ ${o.BeginValue15B}</span>
                    <span class="u-desc">激活效果1号位<em>${o.ActiveAttrib1}</em>${o.ActiveValue1A} ／ ${o.ActiveValue1B}</span>
                    <span class="u-desc">激活效果2号位<em>${o.ActiveAttrib2}</em>${o.ActiveValue2A} ／ ${o.ActiveValue2B}</span>
                    <span class="u-desc">结束效果1号位<em>${o.EndTimeAttrib1}</em>${o.EndTimeValue1A} ／ ${o.EndTimeValue1B}</span>
                    <span class="u-desc">结束效果2号位<em>${o.EndTimeAttrib2}</em>${o.EndTimeValue2A} ／ ${o.EndTimeValue2B}</span>
                    
                    <span class="u-remark" title="每跳增幅">ActiveCoefficient:${o.ActiveCoefficient}</span>
                    <span class="u-remark">ScriptFile:${o.ScriptFile}</span>
                </li>`,
        equip : `<li class="u-item">
                <img class="u-pic" title="IconID:${o.iconID}" src="${JX3BOX.__iconPath}${o.iconID}.png">
                <span class="u-name">${o.name}</span>
                <span class="u-desc">品质:${o.quality}／分数:${o.score}／来源:${o.dropSource}</span>
            </li>`,
    }
    return tpl[type]
}

export default load_resource